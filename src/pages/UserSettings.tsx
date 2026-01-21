import React from 'react';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PreferencesSection from '@/components/settings/PreferencesSection';
import UsageSection from '@/components/settings/UsageSection';
import SubscriptionSection from '@/components/settings/SubscriptionSection';
import UsageHistoryChart from '@/components/settings/UsageHistoryChart';
import ThemeToggle from '@/components/settings/ThemeToggle';
import TierUpgradeRequest from '@/components/settings/TierUpgradeRequest';
import { ArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserSettings = () => {
  const { user } = useUser();

  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          
          <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xl font-semibold">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  Settings
                </h1>
                <p className="text-muted-foreground">
                  {user?.firstName || user?.username} • {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <ThemeToggle />
                <PreferencesSection />
                <UsageSection />
              </div>
              <div className="space-y-6">
                <SubscriptionSection />
                <TierUpgradeRequest />
                <UsageHistoryChart />
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

export default UserSettings;
