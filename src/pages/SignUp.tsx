
import React from 'react';
import { SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const SignUpPage: React.FC = () => {
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
        <h1 className="text-2xl font-bold text-center mb-6">Create a StoryMaker Account</h1>
        <SignUp
          redirectUrl="/"
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
