"use client";

import { AlertCircle } from 'lucide-react';

interface InputErrorProps {
  message?: string;
  className?: string;
}

export function InputError({ message, className = '' }: InputErrorProps) {
  if (!message) return null;
  
  return (
    <div className={`flex items-center gap-1 text-sm text-destructive mt-1 ${className}`}>
      <AlertCircle className="h-3 w-3" />
      <span>{message}</span>
    </div>
  );
}
