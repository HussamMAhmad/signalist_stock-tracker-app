"use client";
import React, { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Controller } from "react-hook-form";
import countryList from "react-select-country-list";
import { ChevronsUpDown } from "lucide-react";

function CountryFieldSelect({
  name,
  label,
  required,
  control,
  error,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const countries = useMemo(() => countryList().getData(), []);

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `please select ${label}` : false }}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="country-select-trigger">
              <Button variant="outline" type="button">
                <span>
                  {field.value ? (
                    <span>
                      {countries.find((c) => c.value === field.value)?.label}
                    </span>
                  ) : (
                    `Select your country...`
                  )}
                </span>
                <ChevronsUpDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-full p-0 bg-gray-800 border-gray-600"
            >
              <Command className=" bg-gray-800">
                <CommandInput placeholder="Type a command or search..." />
                <CommandEmpty className="country-select-empty">
                  No results found.
                </CommandEmpty>
                <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        value={country.value}
                        key={country.value}
                        className="country-select-item bg-gray-800!"
                        onSelect={() => {
                          field.onChange(country.value);
                          setOpen(false);
                        }}
                      >
                        <span>{getFlagEmoji(country.value)}</span>
                        <span>{country.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      <p className="font-medium text-[14px] text-gray-500">
        Helps us show market data and news relevant to you.
      </p>
    </div>
  );
}

export default CountryFieldSelect;
