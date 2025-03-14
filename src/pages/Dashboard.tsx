
import React from 'react';
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useUser();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-storyforge-background to-white">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-storyforge-blue hover:text-storyforge-purple transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display">My Stories</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName || 'Storyteller'}!</p>
            </div>
            
            <Link to="/">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Story
              </Button>
            </Link>
          </div>
        </header>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-storyforge-background p-5 mb-6">
              <Plus className="h-8 w-8 text-storyforge-blue" />
            </div>
            <h2 className="text-2xl font-display font-medium mb-2">No stories yet</h2>
            <p className="text-gray-600 max-w-md mb-6">
              You haven't created any stories yet. Go back to the home page to create your first story!
            </p>
            <Link to="/">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
