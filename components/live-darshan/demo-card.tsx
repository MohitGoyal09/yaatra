"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Users, 
  Sparkles, 
  Heart, 
  Bell, 
  Flower,
  Share2,
  Clock
} from "lucide-react";
import Link from "next/link";

export function LiveDarshanDemoCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse" />
      
      {/* Floating Particles */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <CardTitle className="text-2xl font-bold text-white">
              🕉️ Live Darshan
            </CardTitle>
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-white/80">
            <Users className="w-4 h-4" />
            <span className="text-sm">2.4K watching</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Temple Preview */}
        <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-2">🕉️</div>
              <div className="text-lg font-semibold">Mahakaleshwar Temple</div>
              <div className="text-sm opacity-80">Live from Ujjain</div>
            </div>
          </div>
          
          {/* Overlay Controls Demo */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm p-2 rounded-full">
              <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full">
                <Heart className="w-3 h-3 mr-1" />
                +5
              </Button>
              <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full">
                <Flower className="w-3 h-3 mr-1" />
                +10
              </Button>
              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full">
                <Bell className="w-3 h-3 mr-1" />
                +15
              </Button>
            </div>
          </div>

          {/* Punya Points Counter */}
          <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span className="text-sm font-bold">127 Punya</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl mb-1">🙏</div>
            <div className="text-white text-sm font-medium">Virtual Prayer</div>
            <div className="text-white/60 text-xs">+5 Punya Points</div>
          </div>
          
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl mb-1">🌸</div>
            <div className="text-white text-sm font-medium">Virtual Offering</div>
            <div className="text-white/60 text-xs">+10 Punya Points</div>
          </div>
          
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl mb-1">🔔</div>
            <div className="text-white text-sm font-medium">Temple Bell</div>
            <div className="text-white/60 text-xs">+15 Punya Points</div>
          </div>
          
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl mb-1">✨</div>
            <div className="text-white text-sm font-medium">Share Darshan</div>
            <div className="text-white/60 text-xs">+20 Punya Points</div>
          </div>
        </div>

        {/* Community Features */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold">Community Aarti</h4>
            <div className="flex items-center gap-1 text-orange-400">
              <Clock className="w-3 h-3" />
              <span className="text-xs">6:00 PM</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-white/80 mb-3">
            <span>Next Community Prayer</span>
            <span className="text-orange-400 font-semibold">+50 Punya</span>
          </div>
          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
            Join Community Aarti
          </Button>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/live-darshan">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Experience Live Darshan
            </Button>
          </Link>
          
          <p className="text-white/60 text-sm mt-2">
            Connect with 30 crore pilgrims • Earn Punya Points • Share the sacred moment
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
