
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from '@/components/ui/use-toast';

type VerificationFormProps = {
  onVerify: (code: string) => void;
  email: string;
};

const VerificationForm: React.FC<VerificationFormProps> = ({ onVerify, email }) => {
  const [verificationCode, setVerificationCode] = React.useState("");

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="verification-code">Verification Code</Label>
        <p className="text-sm text-gray-500">
          A verification code has been sent to {email}
        </p>
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
        onClick={() => onVerify(verificationCode)}
        disabled={verificationCode.length < 6}
      >
        Verify Code
      </Button>
    </div>
  );
};

export default VerificationForm;
