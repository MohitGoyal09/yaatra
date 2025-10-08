"use client";

import * as React from "react";
import Link from "next/link";
// Removed useTranslations import to fix runtime error
import {
  MapIcon,
  UsersIcon,
  MessageSquareIcon,
  BarChart3Icon,
  CameraIcon,
  SearchIcon,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
// import { LanguageSwitcher } from "@/components/ui/language-switcher";

const mainNavItems = [
  {
    title: "Map",
    href: "/map",
    icon: MapIcon,
    description: "Interactive map with live updates",
  },
  {
    title: "Social",
    href: "/social",
    icon: UsersIcon,
    description: "Community posts and interactions",
  },
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquareIcon,
    description: "AI-powered chat assistance",
  },
];

const utilityItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3Icon,
    description: "Analytics and insights",
  },
  {
    title: "Live Darshan",
    href: "/live-darshan",
    icon: CameraIcon,
    description: "Live temple darshan",
  },
  {
    title: "Lost & Found",
    href: "/lost-found",
    icon: SearchIcon,
    description: "Find lost items",
  },
];

export function AppNavbar() {
  // Removed useTranslations usage to fix runtime error

  return (
    <div className="flex items-center justify-between p-4 border-b">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">Y</span>
          </div>
          <span className="font-bold text-lg">Yaatra</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <NavigationMenu>
        <NavigationMenuList>
          {/* Main Features */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mt-4 mb-2 text-lg font-medium">
                        Yaatra
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Your complete travel companion for spiritual journeys.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {mainNavItems.map((item) => (
                  <ListItem
                    key={item.title}
                    href={item.href}
                    title={item.title}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Utilities */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-2">
                {utilityItems.map((item) => (
                  <ListItem
                    key={item.title}
                    href={item.href}
                    title={item.title}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Direct Links */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/leaderboard">Leaderboard</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-2">
        {/* <LanguageSwitcher /> */}
        <ModeToggle />
      </div>
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="flex items-center space-x-2 p-3 rounded-md hover:bg-accent"
        >
          {Icon && <Icon className="h-4 w-4" />}
          <div>
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
