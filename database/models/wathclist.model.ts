import { Document, Model, model, models, Schema } from "mongoose";

export interface WatchListItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

const watchlistShema = new Schema<WatchListItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

watchlistShema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Watchlist: Model<WatchListItem> =
  (models?.Watchlist as Model<WatchListItem>) ||
  model<WatchListItem>("watchList", watchlistShema);
