import React from "react";
import Link from "next/link";
import logo from "../public/assets/icons/logo.svg";
import Image from "next/image";
import NavItems from "./navitems";
import Dropdown from "./Dropdown";

function Header() {
  return (
    <div className="top-0 sticky header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>
        <Dropdown />
      </div>
    </div>
  );
}

export default Header;
