"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface NavLink {
  title: string;
  link: string;
}

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

export default function Navbar() {
  const { toast } = useToast();
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenuClick = (title: string) => {
    setActiveMenu(title);
    if (title !== "Dashboard") {
      toast({
        title: `${title} Page Not Found`,
        description: `The ${title} section is currently unavailable and is only a placeholder. Please select Dashboard.`,
      });
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-neutral-800 p-6 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <ul className="hidden md:flex gap-6">
          {navMenus.map(({ title, link }) => (
            <li key={title} className="flex items-center">
              <Link
                href={link}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  activeMenu === title
                    ? "bg-white text-black"
                    : "text-white hover:bg-slate-400 hover:text-black"
                }`}
                onClick={() => handleMenuClick(title)}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="flex w-full gap-2 ml-12 items-center justify-between">
        <Input
          id="search"
          type="text"
          className="bg-white rounded-xl"
          placeholder="Search..."
          icon={<Search className="text-gray-400" />}
        />
        <div className="w-10 h-10 aspect-square bg-white rounded-full flex items-center justify-center">
          <Image
            src="/avatar.jpg"
            alt="User Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full aspect-square object-cover"
          />
        </div>
      </div>

      {isMenuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-neutral-800 flex flex-col gap-4 p-6 md:hidden">
          {navMenus.map(({ title, link }) => (
            <li key={title} className="flex items-center">
              <Link
                href={link}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  activeMenu === title
                    ? "bg-white text-black"
                    : "text-white hover:bg-slate-400 hover:text-black"
                }`}
                onClick={() => handleMenuClick(title)}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
