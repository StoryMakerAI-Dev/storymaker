
import React from 'react';
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 flex items-center"
        onClick={() => navigate("/")}
      >
        <BookOpen className="mr-2" />
        Back to StoryMaker
      </Button>
      
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In to StoryMaker</h1>
        <SignIn
          redirectUrl="/"
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
};

export default SignInPage;
