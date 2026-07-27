import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";

function SelectInfo({
  label,
  name,
  placeholder,
  options,
  control,
  error,
  required,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required
            ? `please select ${label.toLocaleLowerCase()}`
            : false,
        }}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="select-trigger" id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="focus:bg-ray-600 focus:text-white">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </Select>
        )}
      />
    </div>
  );
}

export default SelectInfo;
