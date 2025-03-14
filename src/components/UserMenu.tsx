
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LogIn, UserPlus } from 'lucide-react';

const UserMenu = () => {
  return (
    <div className="flex items-center gap-2">
      <SignedIn>
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">My Stories</Button>
          </Link>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9"
              }
            }}
          />
        </div>
      </SignedIn>
      
      <SignedOut>
        <div className="flex items-center gap-2">
          <Link to="/sign-in">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button variant="secondary" size="sm" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
};

export default UserMenu;
