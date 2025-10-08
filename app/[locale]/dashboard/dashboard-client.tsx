"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  TrendingUp,
  Droplet,
  Leaf,
  Heart,
  Map,
  Camera,
  QrCode,
  MapPin,
  Trophy,
  Target,
  Clock,
  Users,
  Zap,
  Award,
  Bell,
  Activity,
  Eye,
  MessageCircle,
} from "lucide-react";
import { OpenStreetMap } from "@/components/map/openstreet-map";
import { Progress } from "@/components/ui/progress";
import { DonutChart } from "@/components/ui/donut-chart";
import { LeaderboardSnapshot } from "@/components/leaderboard/snapshot";


interface DashboardClientProps {
  user: any;
  achievements: any[];
  serviceCategories: Array<{
    title: string;
    count: number;
    color: string;
  }>;
  statsCards: Array<{
    title: string;
    value: string;
    color: string;
  }>;
  recentActivities: Array<{
    action: string;
    points: number;
  }>;
  rankTitle: string;
  nextRankInfo: {
    nextRank: string;
    needed: number;
    progress: number;
  };
  chartData: Array<{
    category: string;
    value: number;
    fill: string;
  }>;
  totalPoints: number;
}

const DashboardClient = ({
  user,
  achievements,
  serviceCategories,
  statsCards,
  recentActivities,
  rankTitle,
  nextRankInfo,
  chartData,
  totalPoints,
}: DashboardClientProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState({
    activeUsers: 1247,
    todayPoints: 0,
    weeklyStreak: 0,
    notifications: 3,
  });
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const pointsRef = useRef(0);

  const carouselImages = [
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
    "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
  ];

  const [newsItems, setNewsItems] = useState([
    "Kumbh Mela 2025 preparations in full swing at Ram Ghat",
    "New digital services launched for pilgrims convenience",
    "Special VIP darshan arrangements for high-scoring devotees",
    "Environmental initiative: 10,000 trees planted along Shipra River",
  ]);

  const [dynamicStats, setDynamicStats] = useState({
    totalPoints: 0,
    rank: 1,
    level: 1,
    nextLevelPoints: 100,
    progress: 0,
  });

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      text: "YaatraSarthi made our pilgrimage journey so smooth. The point system motivated us to keep the environment clean!",
      rating: 5,
    },
    {
      name: "Priya Patel",
      location: "Ahmedabad",
      text: "The Sarthi volunteers were incredibly helpful. Real-time updates saved us hours of waiting.",
      rating: 5,
    },
    {
      name: "Amit Sharma",
      location: "Mumbai",
      text: "Lost and found feature is a blessing. We reunited with our family within minutes using this app!",
      rating: 5,
    },
  ];

  // Add icons to service categories
  const serviceCategoriesWithIcons = serviceCategories.map(
    (category, index) => {
      const icons = [
        <Droplet className="h-6 w-6" key="droplet" />,
        <Leaf className="h-6 w-6" key="leaf" />,
        <Heart className="h-6 w-6" key="heart" />,
      ];
      return {
        ...category,
        icon: icons[index] || <Heart className="h-6 w-6" key="default" />,
      };
    }
  );

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        todayPoints: prev.todayPoints + Math.floor(Math.random() * 5),
        weeklyStreak: Math.min(prev.weeklyStreak + 1, 7),
      }));
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Animated points counter
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedPoints((prev) => {
        const newPoints = prev + Math.floor(Math.random() * 3);
        pointsRef.current = newPoints;
        return newPoints;
      });
    }, 15000000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic notifications
  useEffect(() => {
    const notifications = [
      "New achievement unlocked! 🎉",
      "Daily bonus available! +50 points",
      "Community event starting soon!",
      "Your rank improved! 📈",
      "New temple added to live darshan! 🕉️",
    ];

    const interval = setInterval(() => {
      const randomNotification =
        notifications[Math.floor(Math.random() * notifications.length)];
      setNotificationMessage(randomNotification);
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }, 15000); // Show notification every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Dynamic news updates
  useEffect(() => {
    const newNewsItems = [
      "Live darshan from Mahakaleshwar Temple now available 24/7",
      "New eco-friendly initiatives launched across Ujjain",
      "Special aarti timings updated for festival season",
      "Digital payment options now available at all temples",
      "Weather update: Perfect conditions for temple visits today",
      "Community cleanup drive scheduled for this weekend",
    ];

    const interval = setInterval(() => {
      setNewsItems((prev) => {
        const randomNews =
          newNewsItems[Math.floor(Math.random() * newNewsItems.length)];
        if (!prev.includes(randomNews)) {
          return [randomNews, ...prev.slice(0, 3)];
        }
        return prev;
      });
    }, 45000); // Update news every 45 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Dynamic Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-bounce">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dynamic Header with Live Stats */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Welcome back, {user.name || "Pilgrim"}! 👋
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {liveStats.activeUsers.toLocaleString()} active users
                </span>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Your current rank:{" "}
              <span className="font-semibold text-primary">{rankTitle}</span>
            </p>
          </div>

          {/* Live Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Today's Points
                  </p>
                  <p className="text-xl font-bold text-yellow-500">
                    {liveStats.todayPoints}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Streak</p>
                  <p className="text-xl font-bold text-green-500">
                    {liveStats.weeklyStreak} days
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-xl font-bold text-purple-500 animate-pulse">
                    {animatedPoints}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 border border-border hover:from-orange-600 hover:to-red-600 transition-all duration-300 cursor-pointer shadow-lg">
              <Link
                href="/claim-karma"
                className="flex items-center gap-3 text-white"
              >
                <div className="bg-white/20 p-2 rounded-full">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium opacity-90">
                    Ready to Claim
                  </p>
                  <p className="text-lg font-bold">Karma Points</p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-75" />
              </Link>
            </div>
          </div>
        </div>

        {/* Leaderboard and Service Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Leaderboard Snapshot */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-96">
                {carouselImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Slide ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      idx === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">
                      Experience Divine Journey
                    </h2>
                    <p className="text-lg">
                      Your spiritual companion in Ujjain
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {carouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-3 h-3 rounded-full ${
                        idx === currentSlide ? "bg-white" : "bg-white/50"
                      }`}
                      title={`Go to slide ${idx + 1}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-lg">
              <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
                <h3 className="text-xl font-bold">Your Service Categories</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {serviceCategoriesWithIcons.map((category, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted transition"
                    >
                      <div className={category.color}>{category.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {category.title}
                        </p>
                      </div>
                      <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {category.count}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition font-semibold">
                  View All Categories
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Carousel */}
        <div className="bg-card rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-96">
            {carouselImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Slide ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  idx === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">
                  Experience Divine Journey
                </h2>
                <p className="text-lg">Your spiritual companion in Ujjain</p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full ${
                    idx === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                  title={`Go to slide ${idx + 1}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {statsCards.slice(3).map((stat: any, idx: number) => (
            <div
              key={idx + 3}
              className={`${stat.color} text-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition`}
            >
              <h3 className="text-sm font-semibold mb-2 opacity-90">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            About YaatraSarthi Digital Platform
          </h2>
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <p className="text-muted-foreground leading-relaxed mb-4">
                YaatraSarthi is a comprehensive digital platform designed to
                enhance the pilgrimage experience in Ujjain. Our innovative
                point-based reward system encourages responsible behavior while
                providing real-time assistance to devotees.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Through our gamified approach, pilgrims earn Punya Points by
                participating in eco-friendly activities, maintaining hygiene,
                helping fellow devotees, and engaging in cultural events. These
                points unlock exclusive rewards including priority darshan,
                blessed meals, and VIP festival passes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With features like Live Karma Map, Sarthi volunteer network, and
                instant lost & found services, we ensure your spiritual journey
                is both meaningful and hassle-free.
              </p>
              <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                Learn More
              </button>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="w-40 h-40 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl font-bold shadow-xl">
                YS
              </div>
              <h3 className="mt-4 font-semibold text-lg text-foreground">
                Digital Initiative
              </h3>
              <p className="text-muted-foreground">For Pilgrims</p>
            </div>
          </div>
        </div>

        {/* Dynamic Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statsCards.map((stat: any, idx: number) => (
            <div
              key={idx}
              className={`${stat.color} text-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}
            >
              <h3 className="text-sm font-semibold mb-2 opacity-90">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold animate-pulse">{stat.value}</p>
              <div className="mt-2 text-xs opacity-75">
                {idx === 0 && "↗ +12% this week"}
                {idx === 1 && "↗ +8% today"}
                {idx === 2 && "↗ +15% this month"}
                {idx === 3 && "↗ +5% today"}
                {idx === 4 && "↗ +20% this week"}
              </div>
            </div>
          ))}
        </div>

        {/* How to Navigate - Flow Chart */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            How to Navigate
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-56 bg-green-600 text-white rounded-full py-4 px-6 text-center shadow-lg">
                <p className="font-bold">1. Register/Login</p>
              </div>
              <div className="h-8 w-1 bg-green-400"></div>
              <div className="w-64 bg-blue-600 text-white rounded-2xl py-4 px-6 text-center shadow-lg">
                <p className="font-bold">2. Choose Your Service</p>
              </div>
              <div className="h-8 w-1 bg-blue-400"></div>
              <div className="w-60 bg-purple-600 text-white rounded-full py-4 px-6 text-center shadow-lg">
                <p className="font-bold">3. Earn Punya Points</p>
              </div>
              <div className="h-8 w-1 bg-purple-400"></div>
              <div className="w-56 bg-orange-600 text-white rounded-2xl py-4 px-6 text-center shadow-lg">
                <p className="font-bold">4. Unlock Rewards</p>
              </div>
              <div className="h-8 w-1 bg-orange-400"></div>
              <div className="w-64 bg-green-700 text-white rounded-full py-4 px-6 text-center shadow-lg">
                <p className="font-bold">5. Enjoy Divine Experience!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Next Mission */}
        <div className="bg-card rounded-lg shadow-lg mb-8">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <h3 className="text-2xl font-bold">Your Next Mission</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <a
              href="/chat"
              className="border-2 border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition text-center"
            >
              <Camera className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold text-foreground mb-2">
                Report Hygiene Issue
              </h4>
              <p className="text-sm text-muted-foreground">
                Use camera to report and earn points
              </p>
            </a>
            <a
              href="/chat"
              className="border-2 border-border rounded-lg p-6 hover:border-green-500 hover:shadow-lg transition text-center"
            >
              <QrCode className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <h4 className="font-semibold text-foreground mb-2">
                Scan & Earn
              </h4>
              <p className="text-sm text-muted-foreground">
                Scan smart bins and water stations
              </p>
            </a>
            <div className="border-2 border-border rounded-lg p-6 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-orange-500" />
              <h4 className="font-semibold text-foreground mb-2">
                Nearby Opportunity
              </h4>
              <p className="text-sm text-muted-foreground">
                Cultural lecture at Ram Ghat in 15 mins (+10 pts)
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Recent Activities and News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-card rounded-lg shadow-lg">
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Activities</h3>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 animate-pulse" />
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Action
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity: any, idx: number) => (
                      <tr
                        key={idx}
                        className="border-t border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-foreground">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {activity.action}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                          <span className="animate-bounce">
                            +{activity.points}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <span className="font-semibold">Live Update:</span> New
                  activity detected! Keep up the great work! 🎉
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-lg">
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-bold">Latest News</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <ChevronRight size={24} />
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {newsItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  >
                    <Star
                      className={`h-5 w-5 text-yellow-500 mt-1 flex-shrink-0 ${
                        idx === 0 ? "animate-spin" : ""
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {item}
                      </p>
                      {idx === 0 && (
                        <p className="text-xs text-green-600 mt-1 font-semibold">
                          🆕 Just in!
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Breaking:</span> More updates
                  coming soon! Stay tuned! 📢
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 to-green-700 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">YaatraSarthi</h3>
              <p className="text-green-100">
                Your trusted companion for spiritual journeys in Ujjain
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-green-100 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="text-green-100 hover:text-white"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-green-100 hover:text-white"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/faq" className="text-green-100 hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/guide" className="text-green-100 hover:text-white">
                    Travel Guide
                  </a>
                </li>
                <li>
                  <a
                    href="/emergency"
                    className="text-green-100 hover:text-white"
                  >
                    Emergency
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy"
                    className="text-green-100 hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-green-100 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-600 pt-8 text-center text-green-100">
            <p>&copy; 2025 YaatraSarthi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardClient;
