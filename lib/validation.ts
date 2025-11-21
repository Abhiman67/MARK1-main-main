/**
 * Validation utilities for resume form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: true }; // Allow empty (optional field)
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

/**
 * Validate phone number (flexible format)
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone.trim()) {
    return { isValid: true }; // Allow empty
  }
  
  // Allow various formats: +1-234-567-8900, (123) 456-7890, 123.456.7890, etc.
  const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Phone number can only contain digits, spaces, and symbols like +()-.' };
  }
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number should have 10-15 digits' };
  }
  
  return { isValid: true };
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): ValidationResult {
  if (!url.trim()) {
    return { isValid: true }; // Allow empty
  }
  
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, error: 'URL must start with http:// or https://' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL (e.g., https://example.com)' };
  }
}

/**
 * Validate date format (YYYY-MM)
 */
export function validateDate(date: string): ValidationResult {
  if (!date.trim()) {
    return { isValid: true }; // Allow empty
  }
  
  const dateRegex = /^\d{4}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { isValid: false, error: 'Date must be in YYYY-MM format' };
  }
  
  const [year, month] = date.split('-').map(Number);
  
  if (year < 1950 || year > 2100) {
    return { isValid: false, error: 'Year must be between 1950 and 2100' };
  }
  
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Month must be between 01 and 12' };
  }
  
  return { isValid: true };
}

/**
 * Safely format date for display, handling invalid dates
 */
export function formatDateSafe(dateStr: string, format: 'short' | 'long' = 'short'): string {
  if (!dateStr) return '';
  
  try {
    // Handle YYYY-MM format
    const date = new Date(dateStr + '-01');
    
    if (isNaN(date.getTime())) {
      return dateStr; // Return original if parsing fails
    }
    
    return date.toLocaleDateString('en-US', {
      month: format === 'short' ? 'short' : 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr; // Return original on error
  }
}

/**
 * Sanitize filename for safe export
 */
export function sanitizeFilename(name: string): string {
  if (!name) return 'Resume';
  
  return name
    .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remove special chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 100); // Limit length
}
