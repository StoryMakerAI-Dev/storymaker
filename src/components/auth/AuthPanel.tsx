
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BookOpen, Library } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getStoredUsers, storeUsers, saveCurrentUser, removeCurrentUser } from '@/utils/authUtils';
import { User, SavedStory } from '@/types/story';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import VerificationForm from './VerificationForm';
import SavedStories from './SavedStories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AuthPanelProps = {
  isLoggedIn: boolean;
  username: string;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onLoadStory?: (story: SavedStory) => void;
};

const AuthPanel: React.FC<AuthPanelProps> = ({ 
  isLoggedIn, 
  username, 
  onLogin, 
  onLogout,
  onLoadStory
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationData, setVerificationData] = useState({
    email: "",
    username: "",
    password: "",
    code: ""
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (username: string) => {
    const users = getStoredUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      onLogin(user);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    removeCurrentUser();
    onLogout();
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const startVerification = (email: string, username: string, password: string) => {
    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    setVerificationData({
      email,
      username,
      password,
      code
    });
    
    setVerificationMode(true);
    
    toast({
      title: "Verification code sent",
      description: `A verification code (${code}) has been sent to ${email}`,
    });
    
    // In a real app, this would be sent via email API
    console.log(`Verification code: ${code} for ${email}`);
  };

  const verifyCode = (enteredCode: string) => {
    if (enteredCode === verificationData.code) {
      // Add new user
      const newUser: User = {
        email: verificationData.email,
        username: verificationData.username,
        password: verificationData.password,
        savedStories: []
      };
      
      const users = getStoredUsers();
      users.push(newUser);
      storeUsers(users);
      
      // Auto login
      setCurrentUser(newUser);
      saveCurrentUser(newUser);
      onLogin(newUser);
      
      // Reset verification state
      setVerificationMode(false);
      setVerificationData({
        email: "",
        username: "",
        password: "",
        code: ""
      });
      
      toast({
        title: "Registration successful!",
        description: `Welcome, ${newUser.username}!`,
      });
    } else {
      toast({
        title: "Invalid verification code",
        description: "Please check the code and try again",
        variant: "destructive",
      });
    }
  };

  const handleLoadStory = (story: SavedStory) => {
    if (onLoadStory) {
      onLoadStory(story);
      toast({
        title: "Story loaded",
        description: "Your saved story has been loaded",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          {isLoggedIn ? username : "Login"}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {verificationMode ? "Email Verification" : 
             !isLoggedIn ? (authMode === 'login' ? "Login to StoryMaker" : "Create an Account") :
             "Your Account"}
          </SheetTitle>
          <SheetDescription>
            {verificationMode ? "Enter the verification code sent to your email" : 
             !isLoggedIn ? (authMode === 'login' ? "Sign in to save and share your stories" : 
            "Create an account to save and share your stories") :
            "Manage your stories and account"}
          </SheetDescription>
        </SheetHeader>
        
        {verificationMode ? (
          <VerificationForm 
            onVerify={verifyCode} 
            email={verificationData.email} 
          />
        ) : isLoggedIn ? (
          <Tabs defaultValue="account" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="stories">My Stories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4 pt-4">
              <div className="text-center">
                <div className="font-medium text-xl">{username}</div>
                <p className="text-muted-foreground">{currentUser?.email}</p>
              </div>
              
              <div className="flex justify-center space-x-2 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="stories" className="pt-4">
              <SavedStories onSelectStory={handleLoadStory} />
            </TabsContent>
          </Tabs>
        ) : authMode === 'login' ? (
          <LoginForm 
            onSuccess={handleLogin} 
            onSwitchMode={() => setAuthMode('register')} 
          />
        ) : (
          <RegisterForm 
            onStartVerification={startVerification} 
            onSwitchMode={() => setAuthMode('login')} 
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AuthPanel;
