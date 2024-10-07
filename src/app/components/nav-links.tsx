"use client";
 
import {
  QueueListIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { 
    name: "Лента изменений", 
    href: "/panel",
    icon: QueueListIcon,
    hrefVirtual: []
  },
  { 
    name: "Пользователи", 
    href: "/panel/users", 
    icon: UserGroupIcon,
    hrefVirtual: [
      /^\/panel\/users\/\d+$/
    ]
  },
];

export default function NavLinks() {
  const pathname = usePathname();
 
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "text-blue-600 underline": 
                  pathname === link.href || 
                  link.hrefVirtual.some(href => href.test(pathname))
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:inline-block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
