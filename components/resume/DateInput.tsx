"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  placeholder?: string;
}

export function DateInput({ value, onChange, label, disabled, placeholder = "MM/YYYY" }: DateInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d]/g, '');
    
    // Format as MM/YYYY
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 6);
    }
    
    onChange(val);
  };

  const handleBlur = () => {
    if (!value) return;
    
    // Validate and format on blur
    const parts = value.split('/');
    if (parts.length === 2) {
      let [month, year] = parts;
      
      // Pad month
      if (month.length === 1) month = '0' + month;
      
      // Validate month (01-12)
      const monthNum = parseInt(month);
      if (monthNum < 1 || monthNum > 12) {
        month = '01';
      }
      
      // Format to YYYY-MM for backend compatibility
      if (year.length === 4) {
        onChange(`${year}-${month}`);
      }
    }
  };

  // Display format (MM/YYYY) but store as YYYY-MM
  const displayValue = value ? 
    (value.includes('-') ? 
      `${value.slice(5, 7)}/${value.slice(0, 4)}` : 
      value) : 
    '';

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={7}
        className="font-mono"
      />
    </div>
  );
}
