"use server";

import { WatchListItem } from "@/database/models/wathclist.model";
import dbConnect from "@/database/mongoose";

export const getWatchlistSymbolsByEmail = async (
  email: string,
): Promise<string[]> => {
  if (!email) return [];
  try {
    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongoose connection not connected");

    const user = await db.collection("user").findOne({ email });

    if (!user) return [];

    const symbols: WatchListItem[] = await db
      .collection("watchList")
      .findOne(
        {
          userId: user.id.toString(),
        },
        {
          symbol: 1,
        },
      )
      .lean();

    return symbols.map((item) => item.symbol);
  } catch (e) {
    console.log("getwatchlistbyemail error : ", e);
    return [];
  }
};
