import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';
import { BookText, Wand2, Sparkles, Dice5, Users, Check, BookOpen } from 'lucide-react';
import PronounSelector from './PronounSelector';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type StoryParams = {
  ageGroup: string;
  genre: string;
  characters: string;
  pronouns: string;
  setting: string;
  theme: string;
  additionalDetails: string;
};

const initialStoryParams: StoryParams = {
  ageGroup: 'children',
  genre: 'fantasy',
  characters: '',
  pronouns: 'she/her',
  setting: '',
  theme: '',
  additionalDetails: '',
};

interface StoryGeneratorProps {
  onStoryGenerated: (story: string, title: string) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

// Login schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Registration schema
const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Define mock user database
type User = {
  email: string;
  username: string;
  password: string;
};

// Get users from localStorage or initialize empty array
const getStoredUsers = (): User[] => {
  const storedUsers = localStorage.getItem('storyMakerUsers');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

// Store users in localStorage
const storeUsers = (users: User[]) => {
  localStorage.setItem('storyMakerUsers', JSON.stringify(users));
};

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ 
  onStoryGenerated, 
  isGenerating,
  setIsGenerating
}) => {
  const [storyParams, setStoryParams] = useState<StoryParams>(initialStoryParams);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [expectedCode, setExpectedCode] = useState("");
  const [authError, setAuthError] = useState("");
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  // Check if user is logged in from localStorage on component mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('storyMakerCurrentUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setIsLoggedIn(true);
      setUsername(user.username);
      setCurrentUser(user);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStoryParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setStoryParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    setAuthError("");
    const users = getStoredUsers();
    const user = users.find(u => u.email === data.email);
    
    if (!user) {
      setAuthError("No account found with this email address");
      return;
    }
    
    if (user.password !== data.password) {
      setAuthError("Incorrect password");
      return;
    }
    
    // Successful login
    setIsLoggedIn(true);
    setUsername(user.username);
    setCurrentUser(user);
    localStorage.setItem('storyMakerCurrentUser', JSON.stringify(user));
    
    toast({
      title: "Login successful!",
      description: `Welcome back, ${user.username}!`,
    });
  };

  const handleRegister = (data: z.infer<typeof registerSchema>) => {
    setAuthError("");
    const users = getStoredUsers();
    
    // Check if email is already registered
    if (users.some(u => u.email === data.email)) {
      setAuthError("An account with this email already exists");
      return;
    }
    
    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedCode(code);
    
    // Show verification screen and simulate email sending
    setVerificationMode(true);
    
    toast({
      title: "Verification code sent",
      description: `A verification code (${code}) has been sent to ${data.email}`,
    });
    
    // In a real app, this would be sent via email API
    console.log(`Verification code: ${code} for ${data.email}`);
  };

  const verifyCode = () => {
    if (verificationCode === expectedCode) {
      // Get registration data
      const data = registerForm.getValues();
      
      // Add new user
      const newUser: User = {
        email: data.email,
        username: data.username,
        password: data.password,
      };
      
      const users = getStoredUsers();
      users.push(newUser);
      storeUsers(users);
      
      // Auto login
      setIsLoggedIn(true);
      setUsername(newUser.username);
      setCurrentUser(newUser);
      localStorage.setItem('storyMakerCurrentUser', JSON.stringify(newUser));
      
      // Reset verification state
      setVerificationMode(false);
      setVerificationCode("");
      setExpectedCode("");
      
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setCurrentUser(null);
    localStorage.removeItem('storyMakerCurrentUser');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const generateRandomStory = () => {
    const randomAgeGroups = ['children', 'teens', 'adults'];
    const randomGenres = ['fantasy', 'adventure', 'mystery', 'science-fiction', 'fairy-tale', 'historical'];
    const randomCharacters = [
      'a brave knight and a wise wizard',
      'a curious child and a mysterious stranger',
      'a talking animal and a magical creature',
      'a space explorer and an alien guide',
      'a detective and a reluctant witness',
      'a pirate captain and a royal advisor'
    ];
    const randomPronouns = ['she/her', 'he/him', 'they/them'];
    const randomSettings = [
      'enchanted forest',
      'floating islands in the sky',
      'abandoned space station',
      'underwater kingdom',
      'ancient ruins',
      'bustling medieval marketplace'
    ];
    const randomThemes = [
      'friendship and loyalty',
      'courage in the face of fear',
      'finding home in unexpected places',
      'the power of knowledge',
      'discovering one\'s true identity',
      'learning to trust others'
    ];

    const randomParams: StoryParams = {
      ageGroup: randomAgeGroups[Math.floor(Math.random() * randomAgeGroups.length)],
      genre: randomGenres[Math.floor(Math.random() * randomGenres.length)],
      characters: randomCharacters[Math.floor(Math.random() * randomCharacters.length)],
      pronouns: randomPronouns[Math.floor(Math.random() * randomPronouns.length)],
      setting: randomSettings[Math.floor(Math.random() * randomSettings.length)],
      theme: randomThemes[Math.floor(Math.random() * randomThemes.length)],
      additionalDetails: '',
    };

    setStoryParams(randomParams);
    
    generateStory(randomParams);
  };

  const validateInputs = (params: StoryParams) => {
    if (!params.characters.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide main characters for your story.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!params.setting.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a setting for your story.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!params.theme.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a theme or lesson for your story.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  // Simple grammar check function
  const performGrammarCheck = (text: string): string => {
    // Replace common grammar issues
    let correctedText = text
      .replace(/ i /g, " I ")
      .replace(/\bi\b/g, "I")
      .replace(/\s\s+/g, " ")
      .replace(/\bi'm\b/g, "I'm")
      .replace(/\bim\b/g, "I'm")
      .replace(/\bdont\b/g, "don't")
      .replace(/\bwont\b/g, "won't")
      .replace(/\bcant\b/g, "can't")
      .replace(/\bit's\b/g, "it's")
      .replace(/\bits\b(?= (a|the|my|your|his|her|their))/g, "it's");
    
    // Ensure periods at end of paragraphs
    correctedText = correctedText.replace(/([a-z])\n/g, "$1.\n");
    
    // Ensure first letter of sentences is capitalized
    correctedText = correctedText.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
    
    return correctedText;
  };

  const generateStory = async (paramsToUse: StoryParams = storyParams) => {
    if (!validateInputs(paramsToUse)) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      setTimeout(() => {
        const title = generateMockTitle(paramsToUse);
        let story = generateMockStory(paramsToUse);
        
        // Apply grammar check
        story = performGrammarCheck(story);
        
        onStoryGenerated(story, title);
        setIsGenerating(false);
        
        toast({
          title: "Story created!",
          description: "Your unique story has been generated with grammar checking applied.",
        });
      }, 2000);
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: "Failed to generate story. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const generateMockTitle = (params: StoryParams): string => {
    const mainCharacter = params.characters.split(' and ')[0] || params.characters.split(',')[0] || "Hero";
    const cleanedMainCharacter = mainCharacter.trim().replace(/^a |^an |^the /i, '');
    const setting = params.setting || "Magical Land";
    
    const titlePrefixes = [
      "The Adventure of",
      "The Tale of",
      "The Journey of",
      "The Quest of",
      "The Story of"
    ];
    
    const titleConnectors = [
      "in the",
      "and the",
      "of the",
      "beyond the"
    ];
    
    const prefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
    const connector = titleConnectors[Math.floor(Math.random() * titleConnectors.length)];
    
    return `${prefix} ${cleanedMainCharacter} ${connector} ${setting}`;
  };

  const generateMockStory = (params: StoryParams): string => {
    // Define the pronoun sets with they/them support
    const pronounPairs: {[key: string]: {subject: string, object: string, possessive: string, reflexive: string}} = {
      "she/her": { subject: "she", object: "her", possessive: "her", reflexive: "herself" },
      "he/him": { subject: "he", object: "him", possessive: "his", reflexive: "himself" },
      "they/them": { subject: "they", object: "them", possessive: "their", reflexive: "themselves" }
    };
    
    // Default to they/them for custom pronouns or if pronouns are not recognized
    let pronounSet = pronounPairs["they/them"];
    
    // Check if the pronouns are in our predefined pairs
    if (params.pronouns in pronounPairs) {
      pronounSet = pronounPairs[params.pronouns];
    }
    
    const storyIntros = {
      children: `Once upon a time in a land far away, where the trees whispered secrets and the rivers sang lullabies, there lived a group of extraordinary friends. ${params.characters || "A brave little fox and a wise old owl"} were known throughout the ${params.setting || "enchanted forest"} for ${pronounSet.possessive} incredible adventures.

One sunny morning, as golden rays filtered through the leaves, our heroes discovered something unusual—a glowing map that appeared out of nowhere! The map showed the way to ${params.theme || "a hidden treasure that could grant one wish to whoever found it"}.

"Should we follow it?" asked the ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "fox"}, eyes wide with excitement.

The ${params.characters ? (params.characters.split(' and ')[1] || "friend").replace(/^a |^an |^the /i, '') : "owl"} nodded wisely. "Every great adventure begins with a single step," ${pronounSet.subject} hooted.

And so, ${pronounSet.possessive} journey began...`,

      teens: `The summer that changed everything started like any other in ${params.setting || "the sleepy coastal town of Azuremist"}. ${params.characters || "Sixteen-year-old Jamie and best friends Kai and Lena"} had no idea that ${pronounSet.possessive} lives were about to take an unexpected turn.

It was the strange lights over the abandoned lighthouse that first caught ${pronounSet.possessive} attention. No one else seemed to notice them—swirling, pulsating colors that appeared only at midnight.

"We should check it out," ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Jamie"} said, already knowing the others would agree. They always did when it came to adventures.

What ${pronounSet.subject} discovered inside the lighthouse would unveil secrets about ${params.theme || "their town's history and their own mysterious connections to it"}. As ${pronounSet.subject} climbed the winding staircase, the air grew thick with anticipation...`,

      adults: `The rain fell in relentless sheets as ${params.characters || "Dr. Eleanor Reeves"} stood at the crossroads of what was and what could be. Three years of research had led to this moment—this decision. The ${params.setting || "ancient manuscript"} lay open on the desk, its secrets finally revealed after centuries of silence.

"You don't have to do this," came a voice from the doorway. ${params.characters ? (params.characters.split(' and ')[1] || "Professor Martin").replace(/^a |^an |^the /i, '') : "Professor Martin"} stood there, concern etched across ${pronounSet.possessive} weathered face.

"We both know that's not true," ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Eleanor"} replied, fingers tracing the symbols that promised ${params.theme || "answers to questions humanity wasn't supposed to ask"}.

Some boundaries weren't meant to be crossed, but the allure of forbidden knowledge had always been humanity's greatest weakness. And perhaps, ${pronounSet.possessive} greatest strength...`
    };
    
    const ageGroup = params.ageGroup as keyof typeof storyIntros;
    return storyIntros[ageGroup] + "\n\n" + generateAdditionalParagraphs(params, pronounSet);
  };

  const generateAdditionalParagraphs = (params: StoryParams, pronounSet: any): string => {
    const paragraphs = {
      children: `
As they ventured deeper into the ${params.setting || "enchanted forest"}, the trees grew taller and the colors more vibrant. Flowers of every hue lined the path, some even greeting ${pronounSet.object} with tiny nods as ${pronounSet.subject} passed by!

"Look!" exclaimed the ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "fox"}, pointing to a clearing ahead. There, bathed in dappled sunlight, stood a circle of mushrooms with tiny doors and windows. It was a village! Tiny creatures with leafy hats peeked out curiously.

An elderberry fairy with gossamer wings approached ${pronounSet.object}. "Welcome, travelers! We've been expecting you," she said with a tinkling laugh. "The treasure you seek is not just gold and jewels, but something far more precious—it's the magic of friendship and courage!"

The ${params.characters ? (params.characters.split(' and ')[1] || "companion").replace(/^a |^an |^the /i, '') : "owl"} looked thoughtful. "Sometimes the greatest treasures are the ones we discover within ${pronounSet.reflexive} during the journey," ${pronounSet.subject} said wisely.

With new friends and a map full of wonders, our heroes continued ${pronounSet.possessive} adventure, ready for whatever magic awaited ${pronounSet.object} just beyond the next hill.`,

      teens: `
The lighthouse keeper's journal revealed a truth that made ${pronounSet.possessive} blood run cold. A hundred years ago, on this very day, ${params.theme || "three teenagers just like them had discovered the gateway—a tear in reality that appeared only during the lunar eclipse. None of them ever returned."} 

"We should tell someone about this," ${params.characters ? (params.characters.split(' and ')[1] || "friend").replace(/^a |^an |^the /i, '') : "Kai"} suggested, but the determination in ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Jamie"}'s eyes said otherwise.

"No one would believe us," ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Jamie"} replied, turning the brittle pages. "Besides, look at this—it says they left something behind, something important."

The journal contained a map, marked with symbols matching the strange birthmarks they'd all shared since childhood. Coincidence? Hardly.

As night fell and the moon began to darken, ${pronounSet.subject} made ${pronounSet.possessive} choice. Sometimes destiny isn't about what happens to you, but about what you choose to confront.`,

      adults: `
The implications were staggering. If ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Eleanor"}'s theory was correct, ${params.theme || "history as they knew it was built on carefully constructed lies. Ancient civilizations hadn't collapsed—they had transcended."} 

"Have you considered the consequences?" ${params.characters ? (params.characters.split(' and ')[1] || "colleague").replace(/^a |^an |^the /i, '') : "Professor Martin"} asked, pouring amber liquid into two glasses. "There are powers that would kill to keep this hidden."

"Is that a threat or a warning?" ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Eleanor"} took the offered drink, studying ${pronounSet.possessive} expression carefully.

"Does it matter?" ${pronounSet.subject} countered. "You've aligned ${pronounSet.reflexive} with forces beyond our understanding. The manuscript isn't just a document—it's a key."

Outside, the storm intensified as if mirroring the tempest of moral ambiguity that surrounded ${pronounSet.object}. Truth had always been valued above all else in academic circles, but some truths came with a price that extended beyond reputations and careers.

"Tomorrow, we cross the point of no return," ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Eleanor"} said, making ${pronounSet.possessive} decision. "The world deserves to know what lies behind the veil."
`
    };
    
    const ageGroup = params.ageGroup as keyof typeof paragraphs;
    return paragraphs[ageGroup];
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 animate-fade-in">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookText className="h-6 w-6 text-storyforge-blue" />
          <h2 className="text-2xl font-display font-bold text-gray-800">Story Generator</h2>
        </div>
        
        <div className="flex items-center gap-4">
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
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <div className="flex justify-center py-4">
                      <InputOTP
                        maxLength={6}
                        value={verificationCode}
                        onChange={setVerificationCode}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={verifyCode}
                  >
                    Verify Code
                  </Button>
                </div>
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
                <div className="space-y-4 py-4">
                  {authError && (
                    <Alert className="mb-4 border-red-200 bg-red-50 text-red-700">
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your password" 
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        className="w-full mt-4" 
                        type="submit"
                      >
                        Login
                      </Button>
                    </form>
                  </Form>
                  
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Don't have an account? <button 
                      className="text-storyforge-blue hover:underline" 
                      onClick={() => {
                        setAuthMode('register');
                        setAuthError("");
                      }}
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {authError && (
                    <Alert className="mb-4 border-red-200 bg-red-50 text-red-700">
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Choose a username" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Create a password (min. 8 characters)" 
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        className="w-full mt-4" 
                        type="submit"
                      >
                        Create Account
                      </Button>
                    </form>
                  </Form>
                  
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Already have an account? <button 
                      className="text-storyforge-blue hover:underline" 
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError("");
                      }}
                    >
                      Log in
                    </button>
                  </p>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="ageGroup">Age Group</Label>
          <Select 
            value={storyParams.ageGroup} 
            onValueChange={(value) => handleSelectChange('ageGroup', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="children">Children (4-12)</SelectItem>
              <SelectItem value="teens">Teens (13-17)</SelectItem>
              <SelectItem value="adults">Adults (18+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select 
            value={storyParams.genre} 
            onValueChange={(value) => handleSelectChange('genre', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="mystery">Mystery</SelectItem>
              <SelectItem value="science-fiction">Science Fiction</SelectItem>
              <SelectItem value="fairy-tale">Fairy Tale</SelectItem>
              <SelectItem value="historical">Historical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="characters">Main Characters</Label>
          <Input
            id="characters"
            name="characters"
            placeholder="e.g., A brave knight, a clever wizard"
            value={storyParams.characters}
            onChange={handleInputChange}
          />
        </div>
        
        <PronounSelector
          value={storyParams.pronouns}
          onChange={(value) => handleSelectChange('pronouns', value)}
          className="mt-4"
        />
        
        <div>
          <Label htmlFor="setting">Setting</Label>
          <Input
            id="setting"
            name="setting"
            placeholder="e.g., Enchanted forest, Space station"
            value={storyParams.setting}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="theme">Theme or Lesson</Label>
          <Input
            id="theme"
            name="theme"
            placeholder="e.g., Friendship, Courage, Honesty"
            value={storyParams.theme}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
          <Textarea
            id="additionalDetails"
            name="additionalDetails"
            placeholder="Any specific elements you'd like included in the story..."
            value={storyParams.additionalDetails}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          className="bg-gradient-to-r from-storyforge-blue to-storyforge-purple hover:opacity-90 transition-opacity"
          onClick={() => generateStory()}
          disabled={isGenerating}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isGenerating ? "Creating Your Story..." : "Generate Story"}
        </Button>
        
        <Button 
          variant="secondary"
          onClick={generateRandomStory}
          disabled={isGenerating}
          className="flex items-center justify-center"
        >
          <Dice5 className="mr-2 h-4 w-4" />
