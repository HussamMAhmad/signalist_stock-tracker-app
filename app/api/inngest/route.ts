import { serve } from "inngest/next";
import { inngest } from "@/lib/inggest/client";
import { sendSignUpEmail, sendDailyNewsSummery } from "@/lib/inggest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendSignUpEmail, sendDailyNewsSummery],
});
