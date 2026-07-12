import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, className }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all" 
        onClick={onClose} 
      />
      
      <div 
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-4 border bg-card p-6 shadow-lg duration-200 sm:rounded-lg animate-in",
          className
        )}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
        </div>
        
        <div className="py-4">
          {children}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
}
