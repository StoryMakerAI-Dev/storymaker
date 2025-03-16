
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BookOpen } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getStoredUsers, storeUsers, saveCurrentUser, removeCurrentUser } from '@/utils/authUtils';
import { User } from '@/types/story';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import VerificationForm from './VerificationForm';

type AuthPanelProps = {
  isLoggedIn: boolean;
  username: string;
  onLogin: (user: User) => void;
  onLogout: () => void;
};

const AuthPanel: React.FC<AuthPanelProps> = ({ 
  isLoggedIn, 
  username, 
  onLogin, 
  onLogout 
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
             authMode === 'login' ? "Login to StoryMaker" : "Create an Account"}
          </SheetTitle>
          <SheetDescription>
            {verificationMode ? "Enter the verification code sent to your email" : 
             authMode === 'login' ? "Sign in to save and share your stories" : 
            "Create an account to save and share your stories"}
          </SheetDescription>
        </SheetHeader>
        
        {verificationMode ? (
          <VerificationForm 
            onVerify={verifyCode} 
            email={verificationData.email} 
          />
        ) : isLoggedIn ? (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="font-medium text-xl">{username}</div>
              <p className="text-muted-foreground">{currentUser?.email}</p>
            </div>
            
            <div className="flex justify-center space-x-2 pt-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
              >
                <BookOpen className="h-4 w-4" />
                <span>My Stories</span>
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
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
