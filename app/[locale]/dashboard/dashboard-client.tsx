"use client"
import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, TrendingUp, Droplet, Leaf, Heart, Map, Camera, QrCode, MapPin, Trophy, Target } from 'lucide-react';
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
  totalPoints
}: DashboardClientProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
    'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'
  ];

  const newsItems = [
    'Kumbh Mela 2025 preparations in full swing at Ram Ghat',
    'New digital services launched for pilgrims convenience',
    'Special VIP darshan arrangements for high-scoring devotees',
    'Environmental initiative: 10,000 trees planted along Shipra River'
  ];

  const testimonials = [
    { name: 'Rajesh Kumar', location: 'Delhi', text: 'YaatraSarthi made our pilgrimage journey so smooth. The point system motivated us to keep the environment clean!', rating: 5 },
    { name: 'Priya Patel', location: 'Ahmedabad', text: 'The Sarthi volunteers were incredibly helpful. Real-time updates saved us hours of waiting.', rating: 5 },
    { name: 'Amit Sharma', location: 'Mumbai', text: 'Lost and found feature is a blessing. We reunited with our family within minutes using this app!', rating: 5 }
  ];

  // Add icons to service categories
  const serviceCategoriesWithIcons = serviceCategories.map((category, index) => {
    const icons = [
      <Droplet className="h-6 w-6" key="droplet" />,
      <Leaf className="h-6 w-6" key="leaf" />,
      <Heart className="h-6 w-6" key="heart" />
    ];
    return {
      ...category,
      icon: icons[index] || <Heart className="h-6 w-6" key="default" />
    };
  });

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
      <main className="container mx-auto px-4 py-8">
        {/* User Welcome Section with Progress */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welcome back, {user.name || 'Pilgrim'}!
          </h1>
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Current Rank:</span>
              <span className="font-semibold text-primary">{rankTitle}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress to {nextRankInfo.nextRank}</span>
                <span className="font-medium">{totalPoints}/{nextRankInfo.needed} points</span>
              </div>
              <Progress value={nextRankInfo.progress} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                {nextRankInfo.needed - totalPoints} points to next rank
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid with Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Statistics Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsCards.slice(0, 3).map((stat: any, idx: number) => (
              <div key={idx} className={`${stat.color} text-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition`}>
                <h3 className="text-sm font-semibold mb-2 opacity-90">{stat.title}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Donut Chart */}
          <div className="bg-card rounded-lg shadow-lg p-6 border">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" />
              Points Distribution
            </h3>
            {chartData.length > 0 ? (
              <DonutChart
                data={chartData}
                category="category"
                value="value"
                className="h-40"
                showTooltip={true}
              />
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start earning points to see distribution</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard and Service Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Leaderboard Snapshot */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-lg border">
              <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
                <h3 className="text-xl font-bold flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Community Leaderboard
                </h3>
              </div>
              <div className="p-6">
                <LeaderboardSnapshot limit={5} />
                <div className="mt-4 text-center">
                  <a 
                    href="/leaderboard" 
                    className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    View Full Leaderboard
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
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
                    <li key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted transition">
                      <div className={category.color}>{category.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{category.title}</p>
                      </div>
                      <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">{category.count}</span>
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
              <img key={idx} src={img} alt={`Slide ${idx + 1}`} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Experience Divine Journey</h2>
                <p className="text-lg">Your spiritual companion in Ujjain</p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {carouselImages.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-3 h-3 rounded-full ${idx === currentSlide ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {statsCards.slice(3).map((stat: any, idx: number) => (
            <div key={idx + 3} className={`${stat.color} text-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition`}>
              <h3 className="text-sm font-semibold mb-2 opacity-90">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">About YaatraSarthi Digital Platform</h2>
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <p className="text-muted-foreground leading-relaxed mb-4">
                YaatraSarthi is a comprehensive digital platform designed to enhance the pilgrimage experience in Ujjain. Our innovative point-based reward system encourages responsible behavior while providing real-time assistance to devotees.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Through our gamified approach, pilgrims earn Punya Points by participating in eco-friendly activities, maintaining hygiene, helping fellow devotees, and engaging in cultural events. These points unlock exclusive rewards including priority darshan, blessed meals, and VIP festival passes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With features like Live Karma Map, Sarthi volunteer network, and instant lost & found services, we ensure your spiritual journey is both meaningful and hassle-free.
              </p>
              <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                Learn More
              </button>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="w-40 h-40 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl font-bold shadow-xl">
                YS
              </div>
              <h3 className="mt-4 font-semibold text-lg text-foreground">Digital Initiative</h3>
              <p className="text-muted-foreground">For Pilgrims</p>
            </div>
          </div>
        </div>

        {/* How to Navigate - Flow Chart */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">How to Navigate</h2>
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
            <a href="/chat" className="border-2 border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition text-center">
              <Camera className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold text-foreground mb-2">Report Hygiene Issue</h4>
              <p className="text-sm text-muted-foreground">Use camera to report and earn points</p>
            </a>
            <a href="/chat" className="border-2 border-border rounded-lg p-6 hover:border-green-500 hover:shadow-lg transition text-center">
              <QrCode className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <h4 className="font-semibold text-foreground mb-2">Scan & Earn</h4>
              <p className="text-sm text-muted-foreground">Scan smart bins and water stations</p>
            </a>
            <div className="border-2 border-border rounded-lg p-6 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-orange-500" />
              <h4 className="font-semibold text-foreground mb-2">Nearby Opportunity</h4>
              <p className="text-sm text-muted-foreground">Cultural lecture at Ram Ghat in 15 mins (+10 pts)</p>
            </div>
          </div>
        </div>

        {/* Recent Activities and News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-card rounded-lg shadow-lg">
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Activities</h3>
              <TrendingUp size={24} />
            </div>
            <div className="p-6">
              {recentActivities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((activity: any, idx: number) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="px-4 py-3 text-foreground">{activity.action}</td>
                          <td className="px-4 py-3 text-right font-semibold text-green-600">+{activity.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No activities yet</p>
                  <p className="text-sm">Start your spiritual journey to see your progress here</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-lg">
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-bold">Latest News</h3>
              <ChevronRight size={24} />
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {newsItems.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">{item}</p>
                  </li>
                ))}
              </ul>
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
              <p className="text-green-100">Your trusted companion for spiritual journeys in Ujjain</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-green-100 hover:text-white">About Us</a></li>
                <li><a href="/services" className="text-green-100 hover:text-white">Services</a></li>
                <li><a href="/contact" className="text-green-100 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/faq" className="text-green-100 hover:text-white">FAQ</a></li>
                <li><a href="/guide" className="text-green-100 hover:text-white">Travel Guide</a></li>
                <li><a href="/emergency" className="text-green-100 hover:text-white">Emergency</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-green-100 hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="text-green-100 hover:text-white">Terms of Service</a></li>
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
