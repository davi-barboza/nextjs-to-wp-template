"use client";
import React from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";
import { TMenuItem } from ".";

/** helper simples para evitar "false" no className */
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type TProps = {
  item: TMenuItem;
  pageName: string;
  setPageName: (value: string) => void;
};

const SidebarItem = ({ item, pageName, setPageName }: TProps) => {
  const pathname = usePathname();

  const isActive = (node: TMenuItem): boolean => {
    if (node.route && node.route === pathname) return true;
    if (node.children?.length) return node.children.some(isActive);
    return false;
  };

  const itemIsActive = isActive(item);

  // Estado visual aberto:
  // - se o parent controla via pageName, usa ele
  // - se pageName vier vazio na 1ª render (SSR), abra se a rota atual pertencer ao item
  const open = pageName ? pageName === item.label.toLowerCase() : itemIsActive;

  const handleClick = () => {
    const key = item.label.toLowerCase();
    const next = pageName !== key ? key : "";
    setPageName(next);
  };

  const hasChildren = !!item.children?.length;
  const href = item.route || "#";

  return (
    <li>
      <Link
        href={href}
        onClick={handleClick}
        aria-current={itemIsActive ? "page" : undefined}
        aria-expanded={hasChildren ? open : undefined}
        className={cx(
          "group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
          "text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4",
          itemIsActive && "bg-graydark dark:bg-meta-4"
        )}
      >
        {item.icon}
        {item.label}

        {hasChildren && (
          <svg
            className={cx(
              "absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-transform",
              open && "rotate-180"
            )}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
              fill="currentColor"
            />
          </svg>
        )}
      </Link>

      {hasChildren && (
        <div
          className={cx(
            "translate transform overflow-hidden transition-[height,opacity]",
            open ? "block" : "hidden"
          )}
        >
          <SidebarDropdown item={item.children!} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
