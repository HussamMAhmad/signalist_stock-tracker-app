"use client";
import { searchStocks } from "@/lib/actions/finnhub.action";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

export function Search({
  renderAs = "button",
  label = "Add stock",
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setloading] = React.useState(false);
  const [stocks, setStocks] = React.useState(initialStocks);

  console.log("initial stocks : ", initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks.slice(0, 10);

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);

    setloading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setloading(false);
    }
  };

  const debounceSearch = useDebounce(handleSearch, 300);

  React.useEffect(() => {
    debounceSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  return (
    <>
      {renderAs === "text" ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog"
      >
        <Command>
          <div className="search-field">
            <CommandInput
              value={searchTerm}
              onValueChange={setSearchTerm}
              placeholder="Type a command or search..."
              className="search-input"
            />
            {loading && <Loader2 className="search-loader" />}
          </div>
          <CommandList className="search-list">
            {loading ? (
              <CommandEmpty className="search-list-empty">
                Loading stocks...
              </CommandEmpty>
            ) : displayStocks?.length === 0 ? (
              <div className="search-list-indicator">
                {isSearchMode ? "No results found" : "No stocks available"}
              </div>
            ) : (
              <ul>
                <div className="search-count">
                  {isSearchMode ? "Search results : " : "Popular stocks"}
                  {` `}({displayStocks?.length || 0})
                </div>
                {displayStocks?.map((stock, i) => {
                  return (
                    <li key={stock.symbol} className="search-item">
                      <Link
                        href={`/stocks/${stock.symbol}`}
                        className="search-item-link"
                        onClick={handleSelectStock}
                      >
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <div className="search-item-name">{stock.name}</div>
                          <div className="text-sm text-gray-500">
                            {stock.symbol} | {stock.exchange} | {stock.type}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
