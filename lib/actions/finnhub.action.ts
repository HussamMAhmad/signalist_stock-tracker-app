"use server";

import { getDateRange, validateArticle, formatArticle } from "../utils";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const NEXT_PUBLIC_FINNHUB_API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? "";

async function fetchJSON<T>(
  url: string,
  revalidateSeconds?: number,
): Promise<T> {
  const fetchOption: RequestInit = revalidateSeconds
    ? {
        cache: "force-cache",
        next: { revalidate: revalidateSeconds },
      }
    : {
        cache: "no-store",
      };

  const response = await fetch(url, fetchOption);

  if (!response.ok)
    throw new Error(
      `finnhub API Error : ${response.status} ${response.statusText}`,
    );

  return (await response.json()) as T;
}

export { fetchJSON };

export async function getNews(
  symbols?: string[],
): Promise<MarketNewsArticle[]> {
  try {
    const range = getDateRange(6);
    const token = NEXT_PUBLIC_FINNHUB_API_KEY;

    const cleanSymbols = symbols
      ? symbols
          .map((item: string) => item.trim().toUpperCase())
          .filter((item) => item.length > 0)
      : [];

    const maxRound = 6;

    if (cleanSymbols.length > 0) {
      const getNews = cleanSymbols.map(
        async (
          symbol,
        ): Promise<{ symbol: string; articles: MarketNewsArticle[] }> => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${range.from}&to=${range.to}&token=${token}`;
            const articles = await fetchJSON<MarketNewsArticle[]>(url, 300);
            return {
              symbol,
              articles: Array.isArray(articles) ? articles : [],
            };
          } catch (e) {
            return { symbol, articles: [] as MarketNewsArticle[] };
          }
        },
      );

      const results = await Promise.all(getNews);
      const articels: MarketNewsArticle[] = [];
      const seenId = new Set<number | string>();
      for (let round = 0; round < maxRound; round++) {
        for (const res of results) {
          const condidate = res.articles[round];
          if (
            condidate &&
            validateArticle(condidate) &&
            !seenId.has(condidate.id)
          ) {
            seenId.add(condidate.id);
            articels.push(condidate);
          }
        }
      }

      if (articels.length > 0) {
        return articels.sort((a, b) => b.datetime! - a.datetime!);
      }
    }

    const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
    const rawNews = await fetchJSON<MarketNewsArticle[]>(generalUrl, 300);
    if (!Array.isArray(rawNews)) return [];

    const uniqueArticles: MarketNewsArticle[] = [];
    const seenId = new Set<number | string>();

    for (const article of rawNews) {
      if (!validateArticle(article)) continue;
      const uniqueKey = `${article.id}-${article.url}-${article.headline}`;
      if (!seenId.has(uniqueKey)) {
        seenId.add(uniqueKey);
        uniqueArticles.push(article);
      }
      if (uniqueArticles.length >= 20) break;
    }
    const formatted = uniqueArticles
      .slice(0, maxRound)
      .map((a, idx) => formatArticle(a, false, undefined, idx));

    return formatted;
  } catch (e) {
    console.error("Failed to fetch news from finnhub:", e);
    throw new Error("failed to fetch news");
  }
}
