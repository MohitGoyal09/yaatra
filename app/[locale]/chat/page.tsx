"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Response } from "@/components/ai-elements/response";
import { GlobeIcon, RefreshCcwIcon, CopyIcon } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import VoiceWidget from "@/components/voice-widget";

const models = [
  { name: "Gemini 2.5 Flash", value: "google/gemini-2.5-flash" },
  { name: "Gemini 2.5 Pro", value: "google/gemini-2.5-pro" },
];

export default function ChatBotDemo() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // Ensure we always send userId to the agent (required by API)
  const { messages, sendMessage, status, setMessages } = useChat();

  useEffect(() => {
    if (!userId) {
      const temp = `user_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
      setUserId(temp);
    }
  }, [userId]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    if (!(hasText || hasAttachments)) return;

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          userId,
          model,
          webSearch,
        },
      }
    );
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative pb-32">
      <div className="space-y-4">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" &&
                  message.parts.filter((part) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === "source-url"
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map(
                          (part: { type: string; url?: string }, i: number) => (
                            <SourcesContent key={`${message.id}-${i}`}>
                              <Source
                                key={`${message.id}-${i}`}
                                href={part.url}
                                title={part.url}
                              />
                            </SourcesContent>
                          )
                        )}
                    </Sources>
                  )}

                {message.parts.map(
                  (
                    part: { type: string; text?: string; url?: string },
                    i: number
                  ) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Fragment key={`${message.id}-${i}`}>
                            <Message from={message.role}>
                              <MessageContent>
                                <Response>{part.text}</Response>
                              </MessageContent>
                            </Message>
                            {message.role === "assistant" &&
                              message.id === messages.at(-1)?.id && (
                                <Actions className="mt-2">
                                  <Action
                                    onClick={() =>
                                      setMessages((prev) => prev.slice(0, -1))
                                    }
                                    label="Retry"
                                  >
                                    <RefreshCcwIcon className="size-3" />
                                  </Action>
                                  <Action
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        part.text || ""
                                      )
                                    }
                                    label="Copy"
                                  >
                                    <CopyIcon className="size-3" />
                                  </Action>
                                </Actions>
                              )}
                          </Fragment>
                        );
                      case "reasoning":
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className="w-full"
                            isStreaming={
                              status === "streaming" &&
                              i === message.parts.length - 1 &&
                              message.id === messages.at(-1)?.id
                            }
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>
                              {part.text || ""}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      default:
                        return null;
                    }
                  }
                )}
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
        </Conversation>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="max-w-4xl mx-auto mb-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Suggested questions to get started:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bottom-1 cursor-pointer">
                {[
                  "What are the best temples to visit in Ujjain?",
                  "How can I earn Punya Points during my visit?",
                  "Tell me about the history of Mahakaleshwar Temple",
                  "What are the must-try local foods in Ujjain?",
                  "How do I report a lost item in Ujjain?",
                  "What are the best times to visit the ghats?",
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(question);
                      handleSubmit({ text: question, files: [] });
                    }}
                    className="text-left p-3 rounded-md border bg-background hover:bg-accent transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0   p-4 z-50">
          <div className="max-w-4xl mx-auto">
            <PromptInput onSubmit={handleSubmit} globalDrop multiple>
              <PromptInputBody>
                <PromptInputAttachments>
                  {(attachment) => <PromptInputAttachment data={attachment} />}
                </PromptInputAttachments>
                <PromptInputTextarea
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                />
              </PromptInputBody>
              <PromptInputToolbar>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  <PromptInputButton
                    variant={webSearch ? "default" : "ghost"}
                    onClick={() => setWebSearch(!webSearch)}
                  >
                    <GlobeIcon size={16} />
                    <span>Search</span>
                  </PromptInputButton>
                  <PromptInputModelSelect
                    onValueChange={(value) => setModel(value)}
                    value={model}
                  >
                    <PromptInputModelSelectTrigger>
                      <PromptInputModelSelectValue />
                    </PromptInputModelSelectTrigger>
                    <PromptInputModelSelectContent>
                      {models.map((m) => (
                        <PromptInputModelSelectItem
                          key={m.value}
                          value={m.value}
                        >
                          {m.name}
                        </PromptInputModelSelectItem>
                      ))}
                    </PromptInputModelSelectContent>
                  </PromptInputModelSelect>
                </PromptInputTools>
                <div className="flex items-center gap-2">
                  <VoiceWidget
                    apiKey={process.env.NEXT_PUBLIC_VAPI_API_KEY || ""}
                    assistantId={
                      process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || ""
                    }
                  />
                  <PromptInputSubmit
                    disabled={!input && !status}
                    status={status}
                  />
                </div>
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
