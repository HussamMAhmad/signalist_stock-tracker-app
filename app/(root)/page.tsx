import React from "react";
import { Button } from "@/components/ui/button";
import Headers from "@/components/Header";
import TradingViewWidget from "@/components/tradingViewWidget";
import {
  MARKET_DATA_WIDGET_CONFIG,
  HEATMAP_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
} from "@/lib/constants";

export const Home = () => {
  const url = "https://s3.tradingview.com/external-embedding/embed-widget-";
  return (
    <main className="min-h-screen text-grey-400">
      <Headers />
      <div className="min-h-screen px-6 py-6">
        <section className="grid w-full gap-8 home-section pb-8">
          <div className="md:col-span-1 xl:col-span-1">
            <TradingViewWidget
              title="Market Overview"
              scriptUrl={`${url}market-overview.js`}
              config={MARKET_OVERVIEW_WIDGET_CONFIG}
              height={600}
              className="custom-chart"
            />
          </div>
          <div className="md:col-span-1 xl:col-span-2">
            <TradingViewWidget
              title="Stock Heatmap"
              scriptUrl={`${url}stock-heatmap.js`}
              config={HEATMAP_WIDGET_CONFIG}
              height={600}
            />
          </div>
        </section>
        <section className="grid w-full gap-8 home-section">
          <div className="h-full md:col-span-1 xl:col-span-1">
            <TradingViewWidget
              scriptUrl={`${url}timeline.js`}
              config={TOP_STORIES_WIDGET_CONFIG}
              height={600}
              className="custom-chart"
            />
          </div>
          <div className="h-full md:col-span-1 xl:col-span-2">
            <TradingViewWidget
              scriptUrl={`${url}market-quotes.js`}
              config={MARKET_DATA_WIDGET_CONFIG}
              height={600}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
