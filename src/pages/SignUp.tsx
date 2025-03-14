
import React from 'react';
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-storyforge-background to-white flex flex-col">
      <header className="container p-4">
        <Link to="/" className="flex items-center gap-2 text-storyforge-blue hover:text-storyforge-purple transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">Create an Account</h1>
            <p className="text-gray-600">Sign up to save and share your stories</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-1 border border-gray-100">
            <ClerkSignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none p-0",
                  header: "font-display",
                  footer: {
                    display: "none"
                  }
                }
              }}
              routing="path"
              path="/sign-up"
            />
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-storyforge-blue hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
