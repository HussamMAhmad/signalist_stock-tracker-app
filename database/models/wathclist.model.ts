import { Document, Schema } from "mongoose";

export interface WatchListItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  adddedAt: Date;
}

const watchlistShema = new Schema({
  userId: { type: String, required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  company: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

watchlistShema.index({ userId: 1, symbol: 1 }, { unique: true });
