"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Package, BarChart3 } from "lucide-react";
import { AdminCrimeReports } from "../../../../components/admin/admin-crime-reports";
import { AdminLostFound } from "../../../../components/admin/admin-lost-found";

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalCrimeReports: 0,
    totalLostFound: 0,
    pendingCrimeReports: 0,
    pendingLostFound: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    if (isLoaded && user) {
      loadStats();
    }
  }, [isLoaded, user, router]);

  const loadStats = async () => {
    try {
      const [crimeReportsRes, lostFoundRes] = await Promise.all([
        fetch("/api/admin/crime-reports?limit=1000"),
        fetch("/api/admin/lost-found?limit=1000"),
      ]);

      const crimeReportsData = await crimeReportsRes.json();
      const lostFoundData = await lostFoundRes.json();

      if (crimeReportsData.success && lostFoundData.success) {
        setStats({
          totalCrimeReports: crimeReportsData.pagination.total,
          totalLostFound: lostFoundData.pagination.total,
          pendingCrimeReports: crimeReportsData.reports.filter(
            (r: any) => r.status === "reported"
          ).length,
          pendingLostFound: lostFoundData.items.filter(
            (i: any) => i.status === "pending" || i.status === "active"
          ).length,
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage crime reports and lost & found items
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="crime-reports" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Crime Reports
            </TabsTrigger>
            <TabsTrigger value="lost-found" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Lost & Found
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Crime Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalCrimeReports}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Crime Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.pendingCrimeReports}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Lost & Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalLostFound}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Lost & Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.pendingLostFound}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crime-reports">
            <AdminCrimeReports onUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="lost-found">
            <AdminLostFound onUpdate={loadStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );}