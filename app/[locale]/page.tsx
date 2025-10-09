"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Globe,
  Menu,
  X,
  PlayCircle,
  Users,
  Map,
  MessageSquare,
  Search,
  ChevronRight,
  Star,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { LiveDarshanDemoCard } from "@/components/live-darshan/demo-card";
import { TestVerificationModal } from "@/components/verification/test-verification-modal";

interface Language {
  code: string;
  name: string;
}

interface NavItem {
  name: string;
  href: string;
}

interface GalleryImage {
  url: string;
  title: string;
}

interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}

const YaatraSarthiHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  const galleryImages: GalleryImage[] = [
    {
      url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
      title: "Mahakaleshwar Temple",
    },
    {
      url: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800",
      title: "Ram Ghat",
    },
    {
      url: "https://images.unsplash.com/photo-1662727736417-331a09304025?q=80&w=1245&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Kumbh Mela",
    },
    {
      url: "https://images.unsplash.com/photo-1686477316633-562a65893e36?q=80&w=1377&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Ujjain Cityscape",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      text: "YaatraSarthi made our pilgrimage journey so smooth. We could easily find our way and connect with other devotees.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      location: "Ahmedabad",
      text: "The real-time updates and navigation features helped us tremendously during the Kumbh Mela.",
      rating: 5,
    },
    {
      name: "Amit Sharma",
      location: "Mumbai",
      text: "Lost and found feature is a blessing. We reunited with our family within minutes!",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollY(scrollY);

      // Set CSS custom properties for parallax effects
      document.documentElement.style.setProperty(
        "--scroll-y-1",
        `${scrollY * 0.1}px`
      );
      document.documentElement.style.setProperty(
        "--scroll-y-2",
        `${Math.max(0, (scrollY - 800) * 0.1)}px`
      );
      document.documentElement.style.setProperty(
        "--scroll-y-3",
        `${Math.max(0, (scrollY - 1200) * 0.05)}px`
      );
      document.documentElement.style.setProperty(
        "--scroll-y-4",
        `${Math.max(0, (scrollY - 1600) * 0.08)}px`
      );
      document.documentElement.style.setProperty(
        "--scroll-y-5",
        `${Math.max(0, (scrollY - 2000) * 0.05)}px`
      );
      document.documentElement.style.setProperty(
        "--opacity-1",
        Math.max(0, 1 - scrollY / 500).toString()
      );
      document.documentElement.style.setProperty(
        "--opacity-2",
        Math.max(0, (scrollY - 2400) * 0.03).toString()
      );
    };

    // Initialize values
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground w-full relative overflow-x-hidden">
      {/* Fixed Background Image - starts after hero section */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 bg-fixed"
        style={{
          backgroundImage: `url('https://www.i4utravels.com/wp-content/uploads/2021/03/1572436388_madhya_pradesh_web.jpg')`,
        }}
      />

      {/* Scrolling Window/Mask */}
      <div className="relative z-10 w-full video-container-override">
        
        {/* Hero Section with video background */}
        <section className="hero-video-section">
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
          >
            <source src="/Ujjain.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark overlay */}
          <div className="hero-overlay bg-gradient-to-r from-black/60 to-black/40"></div>
          
          {/* Content */}
          <div className="hero-content">
            <div 
              className="transform transition-all duration-300"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                opacity: Math.max(0, 1 - scrollY / 500),
              }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">Welcome to YaatraSarthi</h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl drop-shadow-md">Your divine companion for seamless pilgrimage experiences in Ujjain</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-primary hover:bg-primary/90 px-6 md:px-8 py-3 rounded-lg font-semibold text-base md:text-lg transition-colors shadow-lg">
                  Get Started
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 md:px-8 py-3 rounded-lg font-semibold text-base md:text-lg transition-colors border border-white/30">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
            <ChevronDown className="text-white" size={32} />
          </div>
        </section>

        {/* Content sections with background overlay - now with background image */}
        <div className="relative z-10 ">
          
          {/* Quick Access Cards */}
          <section className="py-16 lg:py-24 w-full relative  ">
            {/* Background image overlay for this section */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"
            />
            
            <div className="w-full px-4 mx-auto transform transition-all duration-500 relative z-10 parallax-transform-2">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Quick Access
              </h2>

              {/* Live Darshan Feature - Full Width */}
              <div className="mb-12">
                <LiveDarshanDemoCard />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border">
                  <Users className="text-primary mb-4" size={48} />
                  <h3 className="text-xl md:text-2xl font-bold mb-3">
                    Connect with Sarthi
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Get personalized guidance from local volunteers
                  </p>
                  <a
                    href="/chat"
                    className="text-primary font-semibold flex items-center hover:text-primary/80 transition-colors"
                  >
                    Learn More <ChevronRight size={20} />
                  </a>
                </div>
                <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border">
                  <Map className="text-blue-600 mb-4" size={48} />
                  <h3 className="text-xl md:text-2xl font-bold mb-3">
                    Live Karma Map
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Real-time updates on events and crowd management
                  </p>
                  <a
                    href="/map"
                    className="text-blue-600 font-semibold flex items-center hover:text-blue-500 transition-colors"
                  >
                    View Map <ChevronRight size={20} />
                  </a>
                </div>
                <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border md:col-span-2 lg:col-span-1">
                  <Search className="text-orange-600 mb-4" size={48} />
                  <h3 className="text-xl md:text-2xl font-bold mb-3">
                    Lost & Found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Quickly reunite with lost belongings or family
                  </p>
                  <a
                    href="/lost-found"
                    className="text-orange-600 font-semibold flex items-center hover:text-orange-500 transition-colors"
                  >
                    Access Now <ChevronRight size={20} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Flow Chart with parallax */}
          <section className="py-16 lg:py-24 w-full relative bg-background/25 backdrop-blur-[2px] ">
            {/* Background image overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-0"
            />
            
            <div 
              className="w-full px-4 max-w-7xl mx-auto relative z-10"
              style={{
                transform: `translateY(${Math.max(0, (scrollY - 1200) * 0.05)}px)`,
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How to Navigate</h2>
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center space-y-6 md:space-y-8">
                  {[
                    {
                      title: "Register/Login",
                      color: "bg-primary",
                      width: "w-48",
                    },
                    {
                      title: "Choose Your Service",
                      subtitle: "Dashboard, Map, Sarthi, etc.",
                      color: "bg-blue-600",
                      width: "w-64",
                    },
                    {
                      title: "Get Real-time Updates",
                      color: "bg-purple-600",
                      width: "w-56",
                    },
                    {
                      title: "Connect & Share",
                      color: "bg-orange-600",
                      width: "w-48",
                    },
                    {
                      title: "Enjoy Your Yatra!",
                      color: "bg-primary",
                      width: "w-52",
                    },
                  ].map((step, index) => (
                    <React.Fragment key={index}>
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            step.width,
                            step.color,
                            "text-white rounded-2xl py-4 md:py-6 px-6 md:px-8 text-center shadow-lg"
                          )}
                        >
                          <p className="font-bold text-base md:text-lg">
                            {step.title}
                          </p>
                          {step.subtitle && (
                            <p className="text-sm mt-1 opacity-90">
                              {step.subtitle}
                            </p>
                          )}
                        </div>
                        {index < 4 && (
                          <div className="h-8 md:h-12 w-1 bg-border"></div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Gallery with revealing effect */}
          <section className="py-16 lg:py-24 mb-5 w-full relative bg-background/25 backdrop-blur-[2px]">
            {/* Background image overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 z-0"
            />
            
            <div 
              className="w-full px-4 max-w-7xl mx-auto relative z-10"
              style={{
                transform: `translateY(${Math.max(0, (scrollY - 1600) * 0.08)}px)`,
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Gallery</h2>
              
              {/* Background window reveal for gallery */}
              <div className="relative mb-8">
                <div className="relative z-10 h-64 bg-gradient-to-r from-primary/80 to-secondary/80 rounded-2xl flex items-center justify-center">
                  <h3 className="text-white text-2xl md:text-3xl font-bold">
                    Sacred Moments
                  </h3>
                </div>
              </div>

              {/* Desktop Gallery - Grid with hover effects */}
              <div className="hidden lg:grid lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "relative overflow-hidden rounded-lg shadow-lg group cursor-pointer h-48 md:h-64 transition-all duration-500",
                      idx === currentImageIndex
                        ? "scale-105 ring-4 ring-primary/50"
                        : "scale-100"
                    )}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <p className="text-white font-semibold p-3 md:p-4 text-sm md:text-base transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                        {img.title}
                      </p>
                    </div>
                    {idx === currentImageIndex && (
                      <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
                        Featured
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Gallery - Horizontal Scroll */}
              <div className="lg:hidden relative">
                <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-64 h-48 relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <p className="text-white font-semibold p-3 text-sm">
                          {img.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moving Background Images */}
              <div className="relative h-32 mt-15 opacity-100 overflow-hidden rounded-2xl bg-background/50 backdrop-blur-[2px]">
                {/* Background image overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 z-0"
                />
                
                <div className="absolute inset-0 flex animate-scroll relative z-10">
                  {[...galleryImages, ...galleryImages].map((img, idx) => (
                    <div key={idx} className="flex-shrink-0 w-60 h-32 relative">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover opacity-100 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center relative z-20">
                  {/* <p className="text-foreground font-bold text-lg md:text-xl">
                    Explore Sacred Ujjain
                  </p> */}
                </div>
              </div>

              {/* Gallery Navigation Dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`View gallery image ${idx + 1}`}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      idx === currentImageIndex
                        ? "bg-primary scale-125"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* History section with window effect */}
          <section className="py-16 lg:py-24 mt-30 w-full relative bg-background/40 backdrop-blur-[2px]">
            {/* Background window for history */}
            <div 
              className="absolute top-40 right-0 w-1/2 h-full bg-cover bg-center opacity-25"
              // style={{
              //   backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop')`,
              //   transform: `translateY(${-(scrollY - 3250) * 0.15}px)`,
              //   clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)`,
              // }}
            />

            {/* Main background image overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-0"
            />

            {/* Main background image overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-0"
            />
            
            <div 
              className="w-full px-4 max-w-7xl mx-auto relative z-10"
              style={{
                transform: `translateY(${Math.max(0, (scrollY - 2000) * 0.05)}px)`,
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">History of Ujjain</h2>
              <div className="max-w-4xl mx-auto">
                <div className="bg-background/50 from-primary/5 to-secondary/5 rounded-2xl p-6 md:p-8 shadow-xl border">
                  <div className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed">
                    <p>
                      Ujjain, one of the seven sacred cities (Sapta Puri) in
                      Hinduism, holds a significant place in Indian history and
                      spirituality. Known as Avantika in ancient times, it was
                      the capital of the Avanti Kingdom and a major center of
                      learning and culture.
                    </p>
                    <p>
                      The city is home to the revered Mahakaleshwar Temple, one
                      of the twelve Jyotirlingas, where Lord Shiva is worshipped
                      in his fierce manifestation. Ujjain is also famous for
                      hosting the Kumbh Mela every twelve years, where millions
                      of devotees gather to take a holy dip in the Shipra River.
                    </p>
                    <p>
                      Rich in astronomical heritage, Ujjain was once the prime
                      meridian for Indian astronomers. The Vedha Shala (ancient
                      observatory) and the legacy of great scholars like
                      Kalidasa and Brahmagupta add to its cultural significance.
                    </p>
                    <p>
                      Today, Ujjain continues to be a vibrant pilgrimage
                      destination, blending ancient traditions with modern
                      facilities to serve millions of devotees who visit this
                      holy city annually.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 lg:py-24 bg-muted/50 w-full relative">
            {/* Background image overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-0"
            />
            
            <div 
              className="w-full px-4 max-w-7xl mx-auto relative z-10"
              style={{
                transform: `translateY(${Math.max(0, (scrollY - 2400) * 0.03)}px)`,
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Pilgrims Say</h2>
              <div className="max-w-3xl mx-auto">
                <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 border">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="text-yellow-400 fill-current"
                          size={24}
                        />
                      )
                    )}
                  </div>
                  <p className="text-lg md:text-xl text-center mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="text-center">
                    <p className="font-bold text-lg">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-muted-foreground">
                      {testimonials[currentTestimonial].location}
                    </p>
                  </div>
                  <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentTestimonial(idx)}
                        aria-label={`View testimonial ${idx + 1}`}
                        className={cn(
                          "w-3 h-3 rounded-full transition-colors",
                          idx === currentTestimonial
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative z-10 bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-foreground py-12 lg:py-16 w-full">
            {/* Background image overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-1"
            />
            
            <div className="w-full px-4 max-w-7xl mx-auto relative z-10">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">YaatraSarthi</h3>
                  <p className="text-primary-foreground/80">
                    Your trusted companion for spiritual journeys in Ujjain
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="/about"
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="/services"
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        Services
                      </a>
                    </li>
                    <li>
                      <a
                        href="/contact"
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
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
                      <a
                        href="/faq"
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a
                        href="/guide"
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        Travel Guide
                      </a>
                    </li>
                    <li>
                      <a
                        href="/emergency"
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        Emergency Contacts
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
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="/terms"
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="/disclaimer"
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        Disclaimer
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/80">
                <p>
                  &copy; 2025 YaatraSarthi. All rights reserved. | Last Updated:
                  06 Oct 2025
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default YaatraSarthiHome;
