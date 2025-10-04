"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface VapiWidgetProps {
  publicKey: string;
  assistantId: string;
  mode?: "voice" | "chat";
  theme?: "light" | "dark";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "tiny" | "compact" | "full";
  radius?: "none" | "small" | "medium" | "large";
  baseColor?: string;
  accentColor?: string;
  buttonBaseColor?: string;
  buttonAccentColor?: string;
  mainLabel?: string;
  startButtonText?: string;
  endButtonText?: string;
  emptyChatMessage?: string;
  emptyVoiceMessage?: string;
  requireConsent?: boolean;
  termsContent?: string;
  localStorageKey?: string;
  showTranscript?: boolean;
}

// Dynamically import the VapiWidget to avoid SSR issues
const VapiWidget = dynamic(
  () => import("@vapi-ai/client-sdk-react").then((mod) => mod.VapiWidget),
  {
    ssr: false,
    loading: () => null,
  }
);

export const VapiWidgetComponent: React.FC<VapiWidgetProps> = ({
  publicKey,
  assistantId,
  mode = "chat",
  theme = "light",
  position = "bottom-right",
  size = "full",
  radius = "medium",
  baseColor,
  accentColor,
  buttonBaseColor,
  buttonAccentColor,
  mainLabel = "Talk with Sarthi",
  startButtonText = "Start Voice Chat",
  endButtonText = "End Call",
  emptyChatMessage = "Namaste! I'm Sarthi, your spiritual journey companion. How can I help you explore Ujjain today?",
  emptyVoiceMessage = "Click to start a voice conversation with your spiritual guide",
  requireConsent = false,
  termsContent,
  localStorageKey = "vapi_widget_consent",
  showTranscript = true,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render if we have the required credentials and component is mounted
  if (!isMounted || !publicKey || !assistantId) {
    return null;
  }

  return (
    <VapiWidget
      publicKey={publicKey}
      assistantId={assistantId}
      mode={mode}
      theme={theme}
      position={position}
      size={size}
      radius={radius}
      baseColor={baseColor}
      accentColor={accentColor}
      buttonBaseColor={buttonBaseColor}
      buttonAccentColor={buttonAccentColor}
      mainLabel={mainLabel}
      startButtonText={startButtonText}
      endButtonText={endButtonText}
      emptyChatMessage={emptyChatMessage}
      emptyVoiceMessage={emptyVoiceMessage}
      requireConsent={requireConsent}
      termsContent={termsContent}
      localStorageKey={localStorageKey}
      showTranscript={showTranscript}
      onCallStart={() => {
        console.log("Voice call started");
      }}
      onCallEnd={() => {
        console.log("Voice call ended");
      }}
      onMessage={(message) => {
        console.log("Message received:", message);
      }}
      onError={(error) => {
        console.error("Widget error:", error);
      }}
    />
  );
};

export default VapiWidgetComponent;
