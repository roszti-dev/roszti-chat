"use client";

import React from "react";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkHtml from "remark-html";
import { toast } from "sonner";
import ChatInput from "../chat-input/chat-input";
import { SidebarTrigger } from "../ui/sidebar";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    api: `/api/assistant`,
  });

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  React.useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div className="w-full flex flex-col h-dvh relative">
      <SidebarTrigger />

      <div className="gap-y-3 w-full flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
        {JSON.stringify(error)}
        {messages
          .filter((message) => message.role !== "system")
          .map((message) => (
            <div key={message.id} className="">
              {message.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks, remarkHtml]}
                  key={message.id}
                  className={cn(
                    "py-3 px-4 prose rounded-xl  break-all  whitespace-normal prose-xs md:prose-xs",
                    {
                      "ml-auto bg-primary text-primary-foreground w-max md:max-w-[80%] max-w-full":
                        message.role === "user",
                      "bg-gray-100 text-black md:max-w-[80%] max-w-full":
                        message.role === "assistant",
                    }
                  )}
                >
                  {message.content}
                </ReactMarkdown>
              ) : null}
              <div>
                <div className="">
                  {message.toolInvocations?.map((toolInvocation) => {
                    const { toolName, state } = toolInvocation;

                    if (state !== "result") {
                      switch (toolName) {
                        default:
                          return "Loading...";
                      }
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} className="h-0 w-0"></div>
      </div>

      <div className="pb-6 pt-2 inset-x-0 bottom-0 flex justify-center items-center bg-background">
        <form
          onSubmit={handleSubmit}
          className="relative w-full gap-x-3 flex items-center justify-center"
        >
          <ChatInput input={input} handleInputChange={handleInputChange} />
        </form>
      </div>
    </div>
  );
}
