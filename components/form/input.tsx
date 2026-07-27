import React from "react";
import FormInputProps from "@/glboal";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

function InputInfo({
  label,
  placeholder,
  type,
  name,
  register,
  error,
  value,
  validation,
  disabled,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn("form-input" , {"opacity-50 cursor-not-allowed" : disabled})}
        {...register(name , validation )}
      />
      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );
}

export default InputInfo;
