
import React from 'react';
import { Separator } from "@/components/ui/separator";

const AuthDivider = () => {
  return (
    <div className="relative my-6">
      <Separator />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-white px-2 text-gray-500 text-sm">or continue with email</span>
      </div>
    </div>
  );
};

export default AuthDivider;
