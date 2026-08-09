import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dbConnect from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

const getAuth = async () => {
  const mongoose = await dbConnect();
  const db = mongoose.connection.db;

  if (!db) throw new Error("MongoDB connection not found");

  const authInstance = betterAuth({
    database: mongodbAdapter(db),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      autoSignIn: true,
      maxPasswordLength: 128,
      minPasswordLength: 8,
    },
    plugins: [nextCookies()],
  });

  return authInstance;
};

export const auth = await getAuth();
