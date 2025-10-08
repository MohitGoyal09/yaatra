"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Share2,
  Bell,
  Flower,
  Clock,
  Users,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import { ParticleEffects } from "@/components/live-darshan/particle-effects";
import {
  LeavesParticles,
  AgarbatiParticles,
  AmbientParticles,
  CelebrationParticles,
} from "@/components/live-darshan/simple-particle-system";
import { DevotionalSVGParticles } from "@/components/live-darshan/devotional-svg-particles";
import { VideoOverlayEffects } from "@/components/live-darshan/floating-elements";
import { InteractiveSVGElements } from "@/components/live-darshan/interactive-svg-elements";

// Ujjain temples with their live stream IDs (using sample streams for demo)
const UJJAIN_TEMPLES = {
  mahakal: {
    id: "mahakal",
    name: "Mahakaleshwar Temple",
    streamId: "dQw4w9WgXcQ", // Sample stream ID - replace with actual
    description: "The most sacred Jyotirlinga of Lord Shiva",
    icon: "🕉️",
    color: "bg-purple-500",
    liveViewers: 1247,
  },
  harsiddhi: {
    id: "harsiddhi",
    name: "Harsiddhi Temple",
    streamId: "dQw4w9WgXcQ", // Sample stream ID - replace with actual
    description: "Goddess Annapurna and Harsiddhi Mata",
    icon: "🌸",
    color: "bg-pink-500",
    liveViewers: 892,
  },
  chintaman: {
    id: "chintaman",
    name: "Chintaman Ganesh Temple",
    streamId: "dQw4w9WgXcQ", // Sample stream ID - replace with actual
    description: "Lord Ganesha - Remover of obstacles",
    icon: "🐘",
    color: "bg-orange-500",
    liveViewers: 634,
  },
  kalbhairav: {
    id: "kalbhairav",
    name: "Kalbhairav Temple",
    streamId: "dQw4w9WgXcQ", // Sample stream ID - replace with actual
    description: "Lord Kalbhairav - Guardian of Ujjain",
    icon: "⚡",
    color: "bg-red-500",
    liveViewers: 456,
  },
};

interface LiveDarshanProps {
  initialTemple?: string;
}

export default function LiveDarshanPage({
  initialTemple = "mahakal",
}: LiveDarshanProps) {
  const [selectedTemple, setSelectedTemple] = useState(initialTemple);
  const [punyaPoints, setPunyaPoints] = useState(0);
  const [showEffects, setShowEffects] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [watchTime, setWatchTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [showSVGEffects, setShowSVGEffects] = useState(false);
  const [showFloatingElements, setShowFloatingElements] = useState(true);
  const [ambientMode, setAmbientMode] = useState(true);
  const [showAgarbati, setShowAgarbati] = useState(false);
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [showInteractiveElements, setShowInteractiveElements] = useState(false);

  const videoRef = useRef<HTMLIFrameElement>(null);
  const watchTimeRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-earn points for watching
  useEffect(() => {
    if (isPlaying) {
      watchTimeRef.current = setInterval(() => {
        setWatchTime((prev) => prev + 1);
        // Earn 2 points per minute of watching
        if ((watchTime + 1) % 60 === 0) {
          earnPunyaPoints(2, "watching");
        }
      }, 1000);
    } else {
      if (watchTimeRef.current) {
        clearInterval(watchTimeRef.current);
      }
    }

    return () => {
      if (watchTimeRef.current) {
        clearInterval(watchTimeRef.current);
      }
    };
  }, [isPlaying, watchTime]);

  const earnPunyaPoints = (points: number, action: string) => {
    setPunyaPoints((prev) => prev + points);
    setActiveEffect(action);
    setShowEffects(true);

    // Trigger particle effect
    setTimeout(() => {
      setShowEffects(false);
      setActiveEffect(null);
    }, 3000);

    // Here you would integrate with your existing Punya Points API
    // await fetch('/api/points/update', { method: 'POST', body: JSON.stringify({ points, action }) });
  };

  const handleSpiritualAction = (action: string, points: number) => {
    earnPunyaPoints(points, action);

    // Add haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const handleDevotionalAction = (action: string, points: number) => {
    earnPunyaPoints(points, action);

    // Trigger specific SVG particle effects
    setActiveEffect(action);
    setShowSVGEffects(true);

    // Clear SVG effects after animation duration
    setTimeout(() => {
      setActiveEffect(null);
      setShowSVGEffects(false);
    }, 5000);

    // Special effects for certain actions
    if (action === "agarbati") {
      setShowAgarbati(true);
      setTimeout(() => setShowAgarbati(false), 5000);
    }

    if (points >= 15) {
      setCelebrationMode(true);
      setTimeout(() => setCelebrationMode(false), 3000);
    }

    // Add haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(150);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTemple =
    UJJAIN_TEMPLES[selectedTemple as keyof typeof UJJAIN_TEMPLES];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Particle.js Background Elements */}
      {showFloatingElements && (
        <>
          <LeavesParticles intensity="medium" />
          <AmbientParticles intensity="low" />
        </>
      )}

      {/* Agarbati Particles */}
      {showAgarbati && <AgarbatiParticles intensity="high" />}

      {/* Celebration Particles */}
      {celebrationMode && <CelebrationParticles intensity="high" />}

      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4 relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h1 className="text-2xl font-bold text-white">Live Darshan</h1>
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {currentTemple.liveViewers.toLocaleString()} watching
              </span>
            </div>

            <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-semibold">
                {punyaPoints} Punya
              </span>
            </div>

            {/* Particle Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowFloatingElements(!showFloatingElements)}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                size="sm"
                title="Toggle Leaves"
              >
                {showFloatingElements ? "🌿" : "🌱"}
              </Button>

              <Button
                onClick={() => setShowAgarbati(!showAgarbati)}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-white p-2 rounded-full"
                size="sm"
                title="Toggle Agarbati"
              >
                🪔
              </Button>

              <Button
                onClick={() => setCelebrationMode(!celebrationMode)}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-white p-2 rounded-full"
                size="sm"
                title="Celebration Mode"
              >
                ✨
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 relative z-10">
        {/* Main Video Area - Full Width */}
        <div className="mb-6">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10 overflow-hidden relative">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black">
                {/* Video Player - Hidden YouTube UI */}
                <iframe
                  ref={videoRef}
                  src={`https://www.youtube.com/embed/${
                    currentTemple.streamId
                  }?autoplay=1&mute=${
                    isMuted ? 1 : 0
                  }&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1`}
                  className="w-full h-full border-none"
                  allow="autoplay; encrypted-media"
                  allowFullScreen={false}
                  title={`Live Darshan from ${currentTemple.name}`}
                />

                {/* Video Overlay Effects */}
                <VideoOverlayEffects />

                {/* Devotional SVG Particles */}
                {showSVGEffects && activeEffect && (
                  <DevotionalSVGParticles
                    effect={activeEffect}
                    intensity="medium"
                  />
                )}

                {/* Interactive SVG Elements Overlay */}
                {showInteractiveElements && (
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 animate-appear-zoom">
                    <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-2xl">
                      <InteractiveSVGElements className="scale-90" />
                    </div>
                  </div>
                )}

                {/* Temple Info Overlay */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentTemple.icon}</span>
                    <div>
                      <h3 className="font-bold text-xl">
                        {currentTemple.name}
                      </h3>
                      <p className="text-sm opacity-80">
                        {currentTemple.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Punya Points Counter */}
                <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold">{punyaPoints} Punya</span>
                  </div>
                </div>

                {/* Interactive Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm p-3 rounded-full">
                    {/* Mute/Unmute Button */}
                    <Button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`devotional-button ${
                        isMuted
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-white/20 hover:bg-white/30"
                      } text-white p-3 rounded-full`}
                      size="sm"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>

                    {/* Devotional Action Buttons */}
                    <Button
                      onClick={() => handleDevotionalAction("diya", 5)}
                      className="devotional-button bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full"
                      size="sm"
                      title="Light Diya (+5 points)"
                    >
                      🪔
                    </Button>

                    <Button
                      onClick={() => handleDevotionalAction("thali", 10)}
                      className="devotional-button bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full"
                      size="sm"
                      title="Pooja Thali (+10 points)"
                    >
                      🥘
                    </Button>

                    <Button
                      onClick={() => handleDevotionalAction("bell", 15)}
                      className="devotional-button bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full"
                      size="sm"
                      title="Ring Bell (+15 points)"
                    >
                      🔔
                    </Button>

                    <Button
                      onClick={() => handleDevotionalAction("tulsi", 8)}
                      className="devotional-button bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
                      size="sm"
                      title="Tulsi Leaves (+8 points)"
                    >
                      🌿
                    </Button>

                    <Button
                      onClick={() => handleDevotionalAction("conch", 12)}
                      className="devotional-button bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
                      size="sm"
                      title="Conch Shell (+12 points)"
                    >
                      🐚
                    </Button>

                    <Button
                      onClick={() => handleDevotionalAction("marigold", 7)}
                      className="devotional-button bg-orange-400 hover:bg-orange-500 text-white p-3 rounded-full"
                      size="sm"
                      title="Marigold Flower (+7 points)"
                    >
                      🌼
                    </Button>

                    <Button
                      onClick={() => handleDevotionalAction("agarbati", 12)}
                      className="devotional-button bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full"
                      size="sm"
                      title="Incense Stick (+12 points)"
                    >
                      🪔
                    </Button>

                    <Button
                      onClick={() => handleDevotionalAction("share", 20)}
                      className="devotional-button bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
                      size="sm"
                      title="Share Darshan (+20 points)"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>

                    {/* Interactive Elements Toggle Button */}
                    <Button
                      onClick={() =>
                        setShowInteractiveElements(!showInteractiveElements)
                      }
                      className="devotional-button bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full"
                      size="sm"
                      title="Toggle Interactive Elements"
                    >
                      🪔
                    </Button>

                    {/* Refresh Button */}
                    <Button
                      onClick={() => {
                        setActiveEffect("watching");
                        setShowEffects(true);
                        setTimeout(() => setShowEffects(false), 2000);
                      }}
                      className="devotional-button bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
                      size="sm"
                      title="Refresh Effects"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Play/Pause Control */}
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute bottom-4 right-4 bg-black/80 hover:bg-black/90 text-white p-3 rounded-full"
                  size="sm"
                  title={isPlaying ? "Pause Video" : "Play Video"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4">
              <h4 className="text-white font-semibold mb-3">
                Community Prayer
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>Next Aarti</span>
                  <span>6:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>Community Points</span>
                  <span className="text-orange-400 font-semibold">
                    +50 Punya
                  </span>
                </div>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  Join Community Aarti
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4">
              <h4 className="text-white font-semibold mb-3">
                Spiritual Journey
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>Darshan Time</span>
                  <span>{formatTime(watchTime)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>Points Earned</span>
                  <span className="text-orange-400 font-semibold">
                    {punyaPoints} Punya
                  </span>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
