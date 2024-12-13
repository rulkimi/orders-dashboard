"use client";

import { useState } from "react";
import Link from "next/link";

interface NavLink {
  title: string;
  link: string;
}

export default function Navbar() {
  const navMenus: NavLink[] = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Users", link: "/dashboard" },
    { title: "Merchants", link: "/dashboard" },
    { title: "Transactions", link: "/dashboard" },
    { title: "Vouchers", link: "/dashboard" },
    { title: "Coins", link: "/dashboard" },
    { title: "Assets", link: "/dashboard" },
    { title: "Settings", link: "/dashboard" },
  ];
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <div className="sticky top-0 bg-neutral-800 p-6 flex gap-12 justify-between">
      <ul className="flex gap-6">
        {navMenus.map((menu, index) => (
          <li key={index} className="flex items-center">
            <Link
              href={menu.link}
              className={`px-3 py-1 rounded-full cursor-pointer ${
                activeMenu === menu.title
                  ? "bg-white"
                  : "text-white hover:bg-slate-400 hover:text-black"
              }`}
              onClick={() => setActiveMenu(menu.title)}
            >
              {menu.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex w-full gap-2">
        <input type="text" className="px-3 py-2 w-full rounded-xl" placeholder="Search..." />
        <div
          className="w-10 h-10 aspect-square bg-white rounded-full flex items-center justify-center"
        >
          AH
        </div>
      </div>
    </div>
  );
}
