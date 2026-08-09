// src/inngest/functions.ts
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { sendWelcomeEmail } from "../nodemailer/transporter";
import { gemini } from "@inngest/agent-kit";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email", triggers: { event: "app/user.created" } },
  async ({ event, step }) => {
    const userProfile = `
        - Country: ${event.data.country}
        - Investment goals: ${event.data.InvestmentGoals}
        - Risk tolerance: ${event.data.riskTolerance}
        - Preferred industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      `{{userProfile}}`,
      userProfile,
    );

    const response = await step.ai.infer("generate-welcom-intro", {
      model: step.ai.models.gemini({ model: "gemini-3.5-flash" }),
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
