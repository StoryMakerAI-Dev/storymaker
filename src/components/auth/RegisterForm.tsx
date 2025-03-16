
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from '@/components/ui/use-toast';
import { getStoredUsers } from '@/utils/authUtils';

// Registration schema
const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormProps = {
  onStartVerification: (email: string, username: string, password: string) => void;
  onSwitchMode: () => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onStartVerification, 
  onSwitchMode 
}) => {
  const [authError, setAuthError] = React.useState("");
  
  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const handleRegister = (data: z.infer<typeof registerSchema>) => {
    setAuthError("");
    const users = getStoredUsers();
    
    // Check if email is already registered
    if (users.some(u => u.email === data.email)) {
      setAuthError("An account with this email already exists");
      return;
    }
    
    // Start verification process
    onStartVerification(data.email, data.username, data.password);
  };

  return (
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
          onClick={onSwitchMode}
        >
          Log in
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
