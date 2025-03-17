
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormProps = {
  onSuccess: (email: string, password: string) => void;
  onSwitchMode: () => void;
  onForgotPassword: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchMode, onForgotPassword }) => {
  const [authError, setAuthError] = React.useState("");
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setAuthError("");
    try {
      onSuccess(data.email, data.password);
    } catch (error: any) {
      setAuthError(error.message || "Login failed");
    }
  };

  return (
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
          
          <div className="text-right">
            <button 
              type="button"
              className="text-sm text-storyforge-blue hover:underline"
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          
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
          onClick={onSwitchMode}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
