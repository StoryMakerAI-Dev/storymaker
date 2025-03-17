
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormProps = {
  onSendResetLink: (email: string) => void;
  onBackToLogin: () => void;
};

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  onSendResetLink, 
  onBackToLogin 
}) => {
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // Forgot password form
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setError("");
    setIsSending(true);
    
    try {
      await onSendResetLink(data.email);
    } catch (error: any) {
      setError(error.message || "Failed to send reset link");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50 text-red-700">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
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
          
          <Button 
            className="w-full mt-4" 
            type="submit"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Reset Link"}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full mt-2 flex items-center justify-center"
            onClick={onBackToLogin}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
