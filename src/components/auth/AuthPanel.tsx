import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BookOpen, Library } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { 
  getLoggedInUser, 
  loginUserWithFirebase, 
  registerUserWithFirebase,
  logoutUserWithFirebase, 
  getSavedStories 
} from '@/utils/authUtils';
import { User, SavedStory } from '@/types/story';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import VerificationForm from './VerificationForm';
import SavedStories from './SavedStories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from '@/services/firebase/authService';

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
  const [stories, setStories] = useState<SavedStory[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getLoggedInUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    
    checkAuth();
  }, []);
  
  useEffect(() => {
    const loadStories = async () => {
      if (isLoggedIn) {
        const userStories = await getSavedStories();
        setStories(userStories);
      }
    };
    
    loadStories();
  }, [isLoggedIn]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await loginUserWithFirebase(email, password);
      setCurrentUser(user);
      onLogin(user);
      
      toast({
        title: "Login successful!",
        description: `Welcome back, ${user.username}!`,
      });
      
      const userStories = await getSavedStories();
      setStories(userStories);
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUserWithFirebase();
      setCurrentUser(null);
      onLogout();
      setStories([]);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  const startVerification = async (email: string, username: string, password: string) => {
    try {
      await registerUserWithFirebase(email, username, password);
      
      setVerificationData({
        email,
        username,
        password,
        code: "000000"
      });
      
      setVerificationMode(true);
      
      toast({
        title: "Verification email sent",
        description: `A verification email has been sent to ${email}. Please check your inbox.`,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
    }
  };

  const verifyCode = (enteredCode: string) => {
    toast({
      title: "Account created",
      description: "Your account has been created. Please check your email to verify your account.",
    });
    
    setVerificationMode(false);
    setVerificationData({
      email: "",
      username: "",
      password: "",
      code: ""
    });
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
