"use server";
import { headers } from "next/headers";
import { auth } from "../auth";
import { inngest } from "../inggest/client";

const singUpWithEmail = async ({
  fullName,
  email,
  password,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  const response = await auth.api.signUpEmail({
    body: {
      name: fullName,
      email,
      password,
    },
  });

  if (!response) {
    return { success: false, error: "failed to create account" };
  }

  try {
    await inngest.send({
      name: "app/user.created",
      data: {
        name: fullName,
        email,
        country,
        investmentGoals,
        riskTolerance,
        preferredIndustry,
      },
    });

    return { success: true, data: response };
  } catch (e) {
    console.log("Sign up faild : ", e);
    return { success: false, error: "Sign up failed" };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    console.log("sign out is failed : ", e);
    return { success: false, error: "sign out failed" };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.log("failed to sign in :", error);
    return { success: false, error: "failed to sign in" };
  }
};

export default singUpWithEmail;
