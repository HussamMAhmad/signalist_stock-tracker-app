import React from "react";
import { Toaster } from "@/components/ui/sonner";
import Headers from "@/components/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return redirect("/sign-up");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
  
  return (
    <main className="min-h-screen text-grey-400">
      <Headers user={user}/>
      <div className="">
        {children}
        <Toaster />
      </div>
    </main>
  );
};

export default layout;
