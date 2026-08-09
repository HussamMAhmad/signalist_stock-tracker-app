"use client";
import React from "react";
import InputInfo from "@/components/form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FooterLink from "@/components/form/footerlink";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function SignIn() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const onSubmit: SubmitHandler<SignInFormData> = async (
    data: SignInFormData,
  ) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign in faild", {
        description:
          error instanceof Error ? error.message : "failed to sign in",
      });
    }
  };
  return (
    <div className="flex flex-col justify-center h-full">
      <h1 className="form-title">Log In Your Account</h1>
      <form action="" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputInfo
          name="email"
          label="Email"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is required",
            pattern: /^\w+@\w+\.\w+/,
            message: "Email address is required",
          }}
        />
        <InputInfo
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: "Password is required", minLength: 8 }}
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Logging In" : "Log In"}
        </Button>
      </form>
      <FooterLink
        text="Don't have an account?"
        linkText="Sign Up"
        href="/sign-up"
      />
    </div>
  );
}

export default SignIn;
