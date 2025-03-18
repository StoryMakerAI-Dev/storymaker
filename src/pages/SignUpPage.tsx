
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-storyforge-background to-white p-4">
      <div className="w-full max-w-md">
        <SignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-gradient-to-r from-storyforge-blue to-storyforge-purple hover:opacity-90 transition-opacity",
              card: "bg-white shadow-md rounded-xl border border-gray-100",
              headerTitle: "text-2xl font-display font-bold text-gray-800",
              headerSubtitle: "text-gray-600",
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
