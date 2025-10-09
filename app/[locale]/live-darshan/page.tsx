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

// Ujjain temples with their live stream sources
const UJJAIN_TEMPLES = {
  mahakal: {
    id: "mahakal",
    name: "Mahakaleshwar Temple",
    streamId: "mZEo0DaOGDg",
    description: "The most sacred Jyotirlinga of Lord Shiva - Live Darshan",
    icon: "🕉️",
    color: "bg-purple-500",
    liveViewers: 1247,
    title: "Live Darshan from Mahakaleshwar Temple, Ujjain",
  },
  harsiddhi: {
    id: "harsiddhi",
    name: "Harsiddhi Temple",
    streamId: "mZEo0DaOGDg",
    description: "Goddess Annapurna and Harsiddhi Mata - Live Darshan",
    icon: "🌸",
    color: "bg-pink-500",
    liveViewers: 892,
    title: "Live Darshan from Harsiddhi Temple, Ujjain",
  },
  chintaman: {
    id: "chintaman",
    name: "Chintaman Ganesh Temple",
    streamId: "mZEo0DaOGDg",
    description: "Lord Ganesha - Remover of obstacles - Live Darshan",
    icon: "🐘",
    color: "bg-orange-500",
    liveViewers: 634,
    title: "Live Darshan from Chintaman Ganesh Temple, Ujjain",
  },
  kalbhairav: {
    id: "kalbhairav",
    name: "Kalbhairav Temple",
    streamId: "mZEo0DaOGDg",
    description: "Lord Kalbhairav - Guardian of Ujjain - Live Darshan",
    icon: "⚡",
    color: "bg-red-500",
    liveViewers: 456,
    title: "Live Darshan from Kalbhairav Temple, Ujjain",
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
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

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

  // Handle video loading state
  useEffect(() => {
    // Simulate loading for YouTube iframe
    const timer = setTimeout(() => {
      setVideoLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [selectedTemple]);

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

  const handleVideoLoad = () => {
    setVideoLoading(false);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoLoading(false);
    setVideoError(true);
  };

  const handleTempleChange = (templeId: string) => {
    setSelectedTemple(templeId);
    setVideoLoading(true);
    setVideoError(false);
  };

  const currentTemple =
    UJJAIN_TEMPLES[selectedTemple as keyof typeof UJJAIN_TEMPLES];

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-900 via-orange-900 to-red-900 relative overflow-hidden">
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

      {/* Spiritual Header */}
      <div className="bg-gradient-to-r from-saffron-900/30 via-orange-800/30 to-red-900/30 backdrop-blur-md border-b border-saffron-400/20 p-4 relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-saffron-400 rounded-full animate-pulse shadow-lg shadow-saffron-400/50"></div>
            <h1 className="text-2xl font-bold bg-clip-text text-black">
              Live Darshan
            </h1>
            <Badge className="bg-saffron-600 hover:bg-saffron-700 text-black animate-pulse shadow-lg shadow-saffron-500/30">
              LIVE
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white bg-saffron-800/30 px-3 py-1 rounded-full border border-saffron-400/20">
              <Users className="w-4 h-4 text-saffron-200" />
              <span className="text-sm text-saffron-100">
                {currentTemple.liveViewers.toLocaleString()} watching
              </span>
            </div>

            <div className="flex items-center gap-2 bg-gradient-to-r from-saffron-600/30 to-orange-600/30 px-4 py-2 rounded-full border border-saffron-400/30 shadow-lg shadow-saffron-500/20">
              <Sparkles className="w-4 h-4 text-saffron-300" />
              <span className="text-saffron-200 font-semibold">
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
          <Card className="bg-gradient-to-br from-saffron-900/20 via-orange-800/20 to-red-900/20 backdrop-blur-md border-saffron-400/20 overflow-hidden relative shadow-2xl shadow-saffron-500/10">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black">
                {/* Video Player - YouTube Live Stream */}
                <iframe
                  ref={videoRef}
                  src={`https://www.youtube.com/embed/${
                    currentTemple.streamId
                  }?autoplay=1&mute=${
                    isMuted ? 1 : 0
                  }&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1`}
                  className="w-full h-full border-none"
                  allow="autoplay; encrypted-media"
                  allowFullScreen={false}
                  title={currentTemple.title}
                />

                {/* Video Loading State */}
                {videoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-400 mx-auto mb-4"></div>
                      <p className="text-saffron-200">
                        Loading Live Darshan...
                      </p>
                    </div>
                  </div>
                )}

                {/* Video Title Overlay */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                      <h2 className="text-white text-lg md:text-xl font-bold bg-gradient-to-r from-saffron-100 to-orange-100 bg-clip-text text-transparent">
                        {currentTemple.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 bg-red-600/90 px-3 py-1 rounded-full border border-red-400/30">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-semibold">
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Video Error State */}
                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="text-center text-white p-6">
                      <div className="text-4xl mb-4">🙏</div>
                      <p className="text-saffron-200 mb-2">
                        Unable to load live stream
                      </p>
                      <p className="text-sm text-saffron-300">
                        Please try refreshing the page
                      </p>
                    </div>
                  </div>
                )}

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
                <div className="absolute top-20 left-4 bg-gradient-to-br from-saffron-800/90 via-orange-800/90 to-red-800/90 backdrop-blur-md text-white p-4 rounded-xl border border-saffron-400/30 shadow-2xl shadow-saffron-500/20">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentTemple.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg bg-gradient-to-r from-saffron-100 to-orange-100 bg-clip-text text-transparent">
                        {currentTemple.name}
                      </h3>
                      <p className="text-sm text-saffron-200">
                        {currentTemple.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Punya Points Counter */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-saffron-600/95 to-orange-600/95 backdrop-blur-md text-white px-4 py-2 rounded-full border border-saffron-400/30 shadow-lg shadow-saffron-500/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-saffron-200" />
                    <span className="font-bold text-saffron-100">
                      {punyaPoints} Punya
                    </span>
                  </div>
                </div>

                {/* Spiritual Action Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-saffron-900/90 via-orange-800/90 to-red-900/90 backdrop-blur-md p-4 rounded-2xl border border-orange-400/30 shadow-2xl">
                    {/* Volume Control */}
                    <Button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`devotional-button transition-all duration-300 ${
                        isMuted
                          ? "bg-saffron-600 hover:bg-saffron-700 shadow-lg shadow-saffron-500/30"
                          : "bg-white/20 hover:bg-white/30 border border-white/20"
                      } text-white p-3 rounded-full`}
                      size="sm"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>

                    {/* Diya (Oil Lamp) */}
                    <Button
                      onClick={() => handleDevotionalAction("diya", 5)}
                      className="devotional-button bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-3 rounded-full shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105"
                      size="sm"
                      title="Light Diya (+5 Punya)"
                    >
                      🪔
                    </Button>

                    {/* Bell */}
                    <Button
                      onClick={() => handleDevotionalAction("bell", 15)}
                      className="devotional-button bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-3 rounded-full shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-105"
                      size="sm"
                      title="Ring Temple Bell (+15 Punya)"
                    >
                      🔔
                    </Button>

                    {/* Tulsi Leaves */}
                    <Button
                      onClick={() => handleDevotionalAction("tulsi", 8)}
                      className="devotional-button bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-3 rounded-full shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105"
                      size="sm"
                      title="Offer Tulsi Leaves (+8 Punya)"
                    >
                      🌿
                    </Button>

                    {/* Incense */}
                    <Button
                      onClick={() => handleDevotionalAction("agarbati", 12)}
                      className="devotional-button bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white p-3 rounded-full shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105"
                      size="sm"
                      title="Light Incense (+12 Punya)"
                    >
                      🪔
                    </Button>

                    {/* Share Darshan */}
                    <Button
                      onClick={() => handleDevotionalAction("share", 20)}
                      className="devotional-button bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-3 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                      size="sm"
                      title="Share Darshan (+20 Punya)"
                    >
                      <Share2 className="w-4 h-4" />
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

        {/* Temple Selector */}
        <div className="mb-6">
          <Card className="bg-gradient-to-br from-saffron-800/30 via-orange-700/30 to-red-800/30 backdrop-blur-md border-saffron-400/20 shadow-xl shadow-saffron-500/10">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-center bg-gradient-to-r from-saffron-100 to-orange-100 bg-clip-text text-transparent">
                Choose Your Temple
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(UJJAIN_TEMPLES).map((temple) => (
                  <Button
                    key={temple.id}
                    onClick={() => handleTempleChange(temple.id)}
                    className={`devotional-button transition-all duration-300 ${
                      selectedTemple === temple.id
                        ? "bg-gradient-to-r from-saffron-600 to-orange-600 shadow-lg shadow-saffron-500/30"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    } text-white p-4 rounded-xl`}
                    variant="outline"
                  >
                    <div className="text-center">
                      {/* <div className="text-2xl mb-2">{temple.icon}</div> */}
                      <div className="text-sm font-medium">{temple.name}</div>
                      <div className="text-xs text-saffron-200 mt-1">
                        {temple.liveViewers} watching
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spiritual Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-saffron-800/30 via-orange-700/30 to-red-800/30 backdrop-blur-md border-saffron-400/20 shadow-xl shadow-saffron-500/10">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 text-lg bg-gradient-to-r from-saffron-100 to-orange-100 bg-clip-text text-white">
                Community Prayer
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-saffron-200">
                  <span>Next Aarti</span>
                  <span className="font-semibold">6:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-sm text-saffron-200">
                  <span>Community Points</span>
                  <span className="text-saffron-300 font-semibold">
                    +50 Punya
                  </span>
                </div>
                <Button className="w-full bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 text-white shadow-lg shadow-saffron-500/30 transition-all duration-300">
                  Join Community Aarti
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-saffron-800/30 via-orange-700/30 to-red-800/30 backdrop-blur-md border-saffron-400/20 shadow-xl shadow-saffron-500/10">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 text-lg bg-gradient-to-r from-saffron-100 to-orange-100 bg-clip-text text-white">
                Spiritual Journey
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-saffron-200">
                  <span>Darshan Time</span>
                  <span className="font-semibold">{formatTime(watchTime)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-saffron-200">
                  <span>Points Earned</span>
                  <span className="text-saffron-300 font-semibold">
                    {punyaPoints} Punya
                  </span>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 transition-all duration-300">
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
