import React from 'react';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuickActions from '@/components/dashboard/QuickActions';
import AIUsageDashboard from '@/components/dashboard/AIUsageDashboard';
import WritingGoals from '@/components/dashboard/WritingGoals';
import RecentStories from '@/components/dashboard/RecentStories';
import UsageStats from '@/components/dashboard/UsageStats';
import BulkExportButton from '@/components/story/buttons/BulkExportButton';
import { ArrowLeft, LayoutDashboard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  const { user } = useUser();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-surface via-background to-primary/5">
          <Header />
          
          <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
            {/* Back */}
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            {/* Greeting Header */}
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xl font-semibold">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
                  {greeting()}, {user?.firstName || user?.username}!
                  <Sparkles className="h-5 w-5 text-accent" />
                </h1>
                <p className="text-muted-foreground">Here's your creative overview</p>
              </div>
              <div className="ml-auto">
                <BulkExportButton />
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 space-y-6">
                <QuickActions />
                <AIUsageDashboard />
              </div>
              <div className="space-y-6">
                <UsageStats />
                <WritingGoals />
                <RecentStories />
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </SignedIn>
      
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Dashboard;
