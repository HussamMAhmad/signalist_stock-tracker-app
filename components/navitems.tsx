'use client'
import React from "react";
import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItems() {
    const pathName = usePathname(); 

    const active = (path : string) => {
        if(path === '/') return pathName === '/' ; 

        return pathName.startsWith(path); 
    }
  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
      {NAV_ITEMS.map((item) => (
        <li
          key={item.href}
          className={`hover:text-yellow-500 transition-colors ${active(item.href) ? 'text-gray-100': '' }`}
        >
          <Link href={item.href}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
}

export default NavItems;
