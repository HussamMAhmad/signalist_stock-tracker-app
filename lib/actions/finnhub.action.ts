"use server";

import { getDateRange, validateArticle, formatArticle } from "../utils";
import { POPULAR_STOCK_SYMBOLS } from "../constants";
import { cache } from "react";

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

export const searchStocks = cache(
  async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
      const token = NEXT_PUBLIC_FINNHUB_API_KEY;
      if (!token) {
        console.error(
          "Error in stock search:",
          new Error("FINNHUB API key is not configured"),
        );
        return [];
      }

      const trimmed = typeof query === "string" ? query.trim() : "";

      let results: FinnhubSearchResult[] = [];

      if (!trimmed) {
        const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
        const profiles = await Promise.all(
          top.map(async (sym) => {
            try {
              const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
              const profile = await fetchJSON<any>(url, 3600);
              return { sym, profile } as { sym: string; profile: any };
            } catch (e) {
              console.error("Error fetching profile2 for", sym, e);
              return { sym, profile: null } as { sym: string; profile: any };
            }
          }),
        );
        results = profiles
          .map(({ sym, profile }) => {
            const symbol = sym.toUpperCase();
            const name: string | undefined =
              profile?.name || profile?.ticker || undefined;
            const exchange: string | undefined = profile?.exchange || undefined;
            if (!name) return undefined;
            const r: FinnhubSearchResult = {
              symbol,
              description: name,
              displaySymbol: symbol,
              type: "Common Stock",
            };
            (r as any).__exchange = exchange;
            return r;
          })
          .filter((x): x is FinnhubSearchResult => Boolean(x));
      } else {
        const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
        const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
        results = Array.isArray(data?.result) ? data.result : [];
      }

      const mapped: StockWithWatchlistStatus[] = results
        .map((r) => {
          const upper = (r.symbol || "").toUpperCase();
          const name = r.description || upper;
          const exchangeFromDisplay =
            (r.displaySymbol as string | undefined) || undefined;
          const exchangeFromProfile = (r as any).__exchange as
            | string
            | undefined;
          const exchange = exchangeFromDisplay || exchangeFromProfile || "US";
          const type = r.type || "Stock";
          const item: StockWithWatchlistStatus = {
            symbol: upper,
            name,
            exchange,
            type,
            isInWatchlist: false,
          };
          return item;
        })
        .slice(0, 15);
      return mapped;
    } catch (err) {
      console.error("Error in stock search:", err);
      return [];
    }
  },
);
