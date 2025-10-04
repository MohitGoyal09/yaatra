"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";

interface VoiceWidgetProps {
  apiKey: string;
  assistantId: string;
  config?: Record<string, unknown>;
}

interface TranscriptMessage {
  role: string;
  text: string;
}

export const VoiceWidget: React.FC<VoiceWidgetProps> = ({
  apiKey,
  assistantId,
  config = {},
}) => {
  const [vapi, setVapi] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!apiKey || !assistantId) return;

    // Dynamic import to handle the case where the package might not be installed yet
    const initVapi = async () => {
      try {
        const VapiModule = await import("@vapi-ai/web");
        const Vapi = VapiModule.default;
        const vapiInstance = new Vapi(apiKey);
        setVapi(vapiInstance);

        // Event listeners
        vapiInstance.on("call-start", () => {
          console.log("Voice call started");
          setIsConnected(true);
          setIsLoading(false);
        });

        vapiInstance.on("call-end", () => {
          console.log("Voice call ended");
          setIsConnected(false);
          setIsSpeaking(false);
        });

        vapiInstance.on("speech-start", () => {
          console.log("Assistant started speaking");
          setIsSpeaking(true);
        });

        vapiInstance.on("speech-end", () => {
          console.log("Assistant stopped speaking");
          setIsSpeaking(false);
        });

        vapiInstance.on("message", (message: any) => {
          if (message.type === "transcript") {
            setTranscript((prev) => [
              ...prev,
              {
                role: message.role,
                text: message.transcript,
              },
            ]);
          }
        });

        vapiInstance.on("error", (error: any) => {
          console.error("Vapi error:", error);
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Failed to load Vapi SDK:", error);
        setIsLoading(false);
      }
    };

    initVapi();

    return () => {
      if (vapi) {
        vapi.stop();
      }
    };
  }, [apiKey, assistantId]);

  const startCall = () => {
    if (vapi && !isConnected) {
      setIsLoading(true);
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    if (vapi && isConnected) {
      vapi.stop();
    }
  };

  // If no API key or assistant ID, show disabled widget
  const hasCredentials = apiKey && assistantId;

  return (
    <div className="relative">
      {!isConnected ? (
        <button
          onClick={startCall}
          disabled={isLoading || !hasCredentials}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            transition-all duration-200 ease-in-out
            ${
              isLoading || !hasCredentials
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:scale-105"
            }
          `}
          title={
            hasCredentials
              ? "Start voice conversation"
              : "Voice widget requires API configuration"
          }
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Voice</span>
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={endCall}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
            title="End voice conversation"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">End</span>
          </button>

          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      )}

      {/* Transcript panel - appears when connected */}
      {isConnected && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isSpeaking ? "bg-red-500 animate-pulse" : "bg-green-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-700">
                {isSpeaking ? "Assistant Speaking..." : "Listening..."}
              </span>
            </div>
          </div>

          
        </div>
      )}
    </div>
  );
};

export default VoiceWidget;
