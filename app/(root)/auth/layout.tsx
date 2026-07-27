import React from "react";
import Link from "next/link";
import logo from "@/public/assets/icons/logo.svg";
import Image from "next/image";
import Star from "@/public/assets/icons/star.svg"
import dashboard from "@/public/assets/images/dashboard.png";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            width={140}
            height={32}
            className="auth-logo"
          />
        </Link>
        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>
      <section className="auth-right-section ">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            Signalist turned my watchlist into a winning list. The alerts are
            spot-on, and I feel more confident making moves in the market
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
                <cite className="auth-testimonial-author">- Ethan R.</cite>
                <p className="max-md:text-xs text-gray-500">Retail Investor</p>
            </div>
            <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((star)=> (
                    <Image src={Star} alt="star" key={star} width={20} height={20} className="w-5 h-5"/>
                ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 relative">
            <Image src={dashboard} alt="dashboard" width={1440} height={1150} className="auth-dashboard-preview absolute top-0"/>
        </div>
      </section>
    </main>
  );
}

export default layout;
