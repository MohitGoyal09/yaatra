"use client";
import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; 
import {
  NavigationMenu,
  NavigationMenuItem, 
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Icons } from "@/components/ui/icons";

// Define the navigation links once for easy maintenance
const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/chat", label: "Sarthi" },
  { href: "/live-darshan", label: "🕉️ Live Darshan", highlight: true },
  { href: "/map", label: "Live Karma Map" },
  { href: "/social", label: "Social Feed" },
  { href: "/lost-found", label: "Lost & Found" },
];

export function AppNavbar() {
  // State for mobile menu open/close
  const [isOpen, setIsOpen] = React.useState(false); 

  // Helper component for all the links (used in both desktop and mobile views)
  const NavLinks = ({ isMobile = false }) => (
    <NavigationMenuList 
        // Force the list to stack vertically on mobile (or when isMobile is true)
        className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row lg:space-x-1'}`}
    >
      {navLinks.map((link) => (
        <NavigationMenuItem key={link.href}>
          <NavigationMenuLink
            asChild
            className={`${navigationMenuTriggerStyle()} ${
              link.highlight 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg' 
                : ''
            }`}
            onClick={() => setIsOpen(false)} // Close menu on link click (for mobile)
          >
            <Link href={link.href}>{link.label}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );

  // Helper component for the user/theme controls
  const UserControls = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`flex items-center gap-2 ${
        isMobile ? "justify-start mt-4" : "" 
      }`}
    >
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <ModeToggle />
    </div>
  );

  return (
    <div className="w-full border-b bg-background sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        {/* DESKTOP/MOBILE HEADER ROW */}
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-base font-semibold">
              <Icons.logo className="h-8 w-8" />
              <span>YaatraSarthi</span>
            </Link>
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/leaderboard">Leaderboard</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/chat">Sarthi</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/map">Live Karma Map</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/social">Social Feed</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/lost-found">Lost & Found</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-2">
            {/* Desktop User Controls (Visible on medium/large screens) */}
            <div className="hidden sm:flex">
                <UserControls />
            </div>
            
            {/* Mobile Menu Button (Visible only on small screens) */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted/50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU CONTENT (Dropdown) */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-96 py-4 border-t" : "max-h-0"
          }`}
        >
          {/* FIX: Wrap NavLinks in NavigationMenu to satisfy the component requirement.
            We use 'absolute' and 'w-full' to ensure it renders correctly even though
            it's not functioning as a traditional desktop menu.
          */}
          <NavigationMenu viewport={false} className="w-full">
            <NavLinks isMobile={true} />
          </NavigationMenu>

          {/* Mobile User Controls */}
          <div className="mt-4 pt-4 border-t sm:hidden">
            <UserControls isMobile={true} />
          </div>
        </div>
      </div>
    </div>
  );
}