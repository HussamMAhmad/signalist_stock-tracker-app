"use client";
import React from "react";
import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "@/components/search";

function NavItems({
  initialStocks,
}: {
  initialStocks: StockWithWatchlistStatus[];
}) {
  const pathName = usePathname();

  const active = (path: string) => {
    if (path === "/") return pathName === "/";
    return pathName.startsWith(path);
  };
  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
      {NAV_ITEMS.map((item) => {
        if (item.label === "Search") {
          return (
            <li key="search-trigger">
              <Search
                renderAs="text"
                label="Search"
                initialStocks={initialStocks}
              />
            </li>
          );
        }
        return (
          <li
            key={item.href}
            className={`hover:text-yellow-500 transition-colors ${active(item.href) ? "text-gray-100" : ""}`}
          >
            <Link href={item.href}>{item.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default NavItems;
