"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
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
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-[100] shadow-sm">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Link
          href="/"
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="YaatraSarthi Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            YaatraSarthi
          </span>
        </Link>
      </div>

      {/* Main Navigation - Visible Buttons */}
      <div className="hidden lg:flex items-center space-x-1">
        {/* Primary Navigation Items */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className={`hover:bg-primary/10 hover:text-primary transition-colors ${
            pathname.includes("/map") ? "bg-primary/10 text-primary" : ""
          }`}
        >
          <Link href="/map" className="flex items-center gap-2 px-3 py-2">
            <MapIcon className="h-4 w-4" />
            <span>Map</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Link href="/social" className="flex items-center gap-2 px-3 py-2">
            <UsersIcon className="h-4 w-4" />
            <span>Social</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Link href="/chat" className="flex items-center gap-2 px-3 py-2">
            <MessageSquareIcon className="h-4 w-4" />
            <span>Chat</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Link
            href="/live-darshan"
            className="flex items-center gap-2 px-3 py-2"
          >
            <CameraIcon className="h-4 w-4" />
            <span>Live Darshan</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2">
            <BarChart3Icon className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </Button>

        {/* Secondary Navigation - Dropdown for additional items */}
        <NavigationMenu className="relative z-[110]">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="hover:bg-primary/10 hover:text-primary transition-colors">
                More
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-2 p-2">
                  <ListItem
                    href="/leaderboard"
                    title="Leaderboard"
                    icon={SearchIcon}
                  >
                    View rankings and achievements
                  </ListItem>
                  <ListItem
                    href="/lost-found"
                    title="Lost & Found"
                    icon={SearchIcon}
                  >
                    Find lost items and help others
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

      {/* Mobile Navigation - Dropdown for smaller screens */}
      <div className="lg:hidden">
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
      <div className="flex items-center space-x-3">
        {/* <LanguageSwitcher /> */}
        <ModeToggle />

        {/* Authentication Buttons */}
        {isSignedIn ? (
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-sm text-muted-foreground">
              Welcome, {user.firstName || "User"}
            </span>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </nav>
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
