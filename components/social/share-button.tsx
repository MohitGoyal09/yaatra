"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ShareContent {
  title: string;
  text: string;
  url: string;
}

interface ShareButtonProps {
  platform: string;
  content: ShareContent;
  onSuccess: (platform: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ShareButton({ 
  platform, 
  content, 
  onSuccess, 
  disabled = false, 
  className = "",
  children 
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (disabled || isSharing) return;
    
    setIsSharing(true);
    
    try {
      let success = false;
      
      switch (platform) {
        case 'web_share':
          success = await shareWithWebAPI();
          break;
        case 'whatsapp':
          success = await shareWithWhatsApp();
          break;
        case 'twitter':
          success = await shareWithTwitter();
          break;
        case 'facebook':
          success = await shareWithFacebook();
          break;
        case 'clipboard':
          success = await copyToClipboard();
          break;
        default:
          success = await copyToClipboard();
      }
      
      if (success) {
        // Record the share in backend
        await recordShare(platform);
        onSuccess(platform);
        console.log('Shared successfully! +10 points awarded');
      } else {
        console.error('Failed to share. Please try again.');
      }
    } catch (error) {
      console.error('Share error:', error);
      console.error('Something went wrong. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const shareWithWebAPI = async (): Promise<boolean> => {
    if (!navigator.share) {
      return await copyToClipboard();
    }
    
    try {
      await navigator.share({
        title: content.title,
        text: content.text,
        url: content.url,
      });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Web Share API error:', error);
        return await copyToClipboard();
      }
      return false;
    }
  };

  const shareWithWhatsApp = async (): Promise<boolean> => {
    const text = `${content.text}\n\n${content.url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    
    try {
      window.open(url, '_blank', 'width=600,height=400');
      return true;
    } catch (error) {
      console.error('WhatsApp share error:', error);
      return false;
    }
  };

  const shareWithTwitter = async (): Promise<boolean> => {
    const text = `${content.text}\n\n${content.url}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    
    try {
      window.open(url, '_blank', 'width=600,height=400');
      return true;
    } catch (error) {
      console.error('Twitter share error:', error);
      return false;
    }
  };

  const shareWithFacebook = async (): Promise<boolean> => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}&quote=${encodeURIComponent(content.text)}`;
    
    try {
      window.open(url, '_blank', 'width=600,height=400');
      return true;
    } catch (error) {
      console.error('Facebook share error:', error);
      return false;
    }
  };

  const copyToClipboard = async (): Promise<boolean> => {
    const text = `${content.text}\n\n${content.url}`;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      console.log('Copied to clipboard!');
      return true;
    } catch (error) {
      console.error('Clipboard error:', error);
      console.error('Failed to copy to clipboard');
      return false;
    }
  };

  const recordShare = async (platform: string) => {
    try {
      const response = await fetch('/api/social/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          achievementType: 'task', // This should be passed as prop
          platform: platform,
          templateUsed: 'default',
          contentPreview: content.text.substring(0, 100) + '...',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record share');
      }
    } catch (error) {
      console.error('Error recording share:', error);
      // Don't throw here, as the share might have succeeded even if recording failed
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={disabled || isSharing}
      className={`${className} ${isSharing ? 'opacity-50' : ''}`}
      size="sm"
    >
      {isSharing ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Sharing...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
