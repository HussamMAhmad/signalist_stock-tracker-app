"use client";
import React from "react";
import InputInfo from "@/components/form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import SelectInfo from "@/components/form/select";
import {
  INVESTMENT_GOALS,
  RISK_TOLERANCE_OPTIONS,
  PREFERRED_INDUSTRIES,
} from "@/lib/constants";
import CountryFieldSelect from "@/components/form/CountryFieldSelect";
import FooterLink from "@/components/form/footerlink";

function SignUp() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "US",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });
  const onSubmit: SubmitHandler<SignUpFormData> = async (
    data: SignUpFormData,
  ) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1 className="form-title">Sign Up & Personalize</h1>
      <form action="" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputInfo
          name="fullName"
          label="Full Name"
          placeholder="Enter your Name"
          type="text"
          register={register}
          error={errors.fullName}
          validation={{ required: "full Name is required", minlength: 2 }}
        />
        <InputInfo
          name="email"
          label="Eamil"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is required",
            pattern: /^\w+@\w+\.\w+/,
            message: "Email address is required",
          }}
        />
        <SelectInfo
          name="investmentGoals"
          label="investment"
          required={true}
          placeholder="Select"
          error={errors.investmentGoals}
          control={control}
          options={INVESTMENT_GOALS}
        />
        <SelectInfo
          name="riskTolerance"
          label="Risk Tolerance"
          required={true}
          placeholder="Select Your risk level"
          error={errors.riskTolerance}
          control={control}
          options={RISK_TOLERANCE_OPTIONS}
        />
        <SelectInfo
          name="preferredIndustry"
          label="Preferred Industry"
          required={true}
          placeholder="Select Your prefered industry"
          error={errors.preferredIndustry}
          control={control}
          options={PREFERRED_INDUSTRIES}
        />
        <CountryFieldSelect
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />
        <InputInfo
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: "Password is required", minlength: 8 }}
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Creating Account" : "Start Your Investing Journey"}
        </Button>
      </form>
      <FooterLink text="Already have an account?" linkText="Log In" href="/auth/sign-in"/>
    </div>
  );
}

export default SignUp;
