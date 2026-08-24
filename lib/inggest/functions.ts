// src/inngest/functions.ts
import { inngest } from "./client";
import {
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
  NEWS_SUMMARY_EMAIL_PROMPT,
} from "./prompts";
import { sendNews, sendWelcomeEmail } from "../nodemailer/transporter";
import { getAllUsers } from "../actions/getusers";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.action";
import { getNews } from "../actions/finnhub.action";
import { formatDateToday } from "../utils";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email", triggers: { event: "app/user.created" } },
  async ({ event, step }) => {
    const userProfile = `
        - Country: ${event.data.country}
        - Investment goals: ${event.data.investmentGoals}
        - Risk tolerance: ${event.data.riskTolerance}
        - Preferred industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      `{{userProfile}}`,
      userProfile,
    );

    const response = await step.ai.infer("generate-welcom-intro", {
      model: step.ai.models.gemini({ model: "gemini-3.6-flash" }),
      // body is the model request, which is strongly typed depending on the model
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-welcom-email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && "text" in part ? part.text : null) ||
        "thanks for joining signalist. You now have the tools to track markets and make smarter moves";
      const {
        data: { email, name },
      } = event;
      return await sendWelcomeEmail({
        name,
        email,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  },
);

export const sendDailyNewsSummery = inngest.createFunction(
  {
    id: "daily-news-summery",
    triggers: [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
  },
  async ({ step }) => {
    const users = await step.run("get-all-users", getAllUsers);
    if (!users)
      return { success: false, message: "no users found for news email" };
    const results = await step.run("fetch-user-news", async () => {
      const perUser: Array<{ user: any; articles: MarketNewsArticle[] }> = [];
      for (const user of users) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          articles = (articles || []).slice(0, 6);
          if (!articles || articles.length == 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (e) {
          console.error(
            "daily news : error preparing user news",
            user.email,
            e,
          );
          perUser.push({ user, articles: [] });
        }
      }
      return perUser;
    });
    // step #3
    const userNewsSummaries: { user: User; newsContent: string | null }[] = [];
    for (const { user, articles } of results) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          `{{newsData}}`,
          JSON.stringify(articles, null, 2),
        );

        const response = await step.ai.infer(`generate-news-${user.email}`, {
          model: step.ai.models.gemini({ model: "gemini-3.6-flash" }),
          body: {
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent =
          (part && "text" in part ? part.text : null) || "No market news.";
        userNewsSummaries.push({ user, newsContent });
      } catch (e) {
        console.error("Failed to summarize news for :", user.email);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }
    // step #4 :
    await step.run("send-news-emails", async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;
          return await sendNews({
            email: user.email,
            date: formatDateToday,
            newsContent,
          });
        }),
      );
    });

    return {
      success: true,
      message: "Daily news summary emails sent successfully",
    };
  },
);
