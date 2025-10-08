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
  ShieldIcon,
  MapPinIcon,
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
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">Y</span>
          </div>
          <span className="font-bold text-lg">Yaatra</span>
        </Link>
      </div>

      {/* Main Navigation - Visible Buttons */}
      <div className="hidden md:flex items-center space-x-1">
        {/* Primary Navigation Items */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/map" className="flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            <span>Map</span>
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/social" className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            <span>Social</span>
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/chat" className="flex items-center gap-2">
            <MessageSquareIcon className="h-4 w-4" />
            <span>Chat</span>
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/live-darshan" className="flex items-center gap-2">
            <CameraIcon className="h-4 w-4" />
            <span>Live Darshan</span>
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <BarChart3Icon className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/leaderboard" className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            <span>Leaderboard</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/lost-found" className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            <span>Lost & Found</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/live-population-map" className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span>Live Population</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/crime-reports" className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4" />
            <span>Crime Report</span>
          </Link>
        </Button>
      </div>

      {/* Mobile Navigation - Dropdown for smaller screens */}
      <div className="md:hidden">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-2">
                  {[...mainNavItems, ...utilityItems].map((item) => (
                    <ListItem
                      key={item.title}
                      href={item.href}
                      title={item.title}
                      icon={item.icon}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                  <ListItem
                    href="/leaderboard"
                    title="Leaderboard"
                    icon={SearchIcon}
                  >
                    View rankings and achievements
                  </ListItem>
                  <ListItem
                    href="/live-population-map"
                    title="Live Population"
                    icon={MapPinIcon}
                  >
                    Real-time population density map
                  </ListItem>
                  <ListItem
                    href="/crime-reports"
                    title="Crime Report"
                    icon={ShieldIcon}
                  >
                    Report and view crime incidents
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

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
