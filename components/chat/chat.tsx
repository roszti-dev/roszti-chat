"use client";

import React from "react";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { SendHorizonal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkHtml from "remark-html";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error, append } =
    useChat({
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
    <div className="w-full flex flex-col h-dvh">
      <div className="gap-y-3 w-full flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
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
                {/* {message.toolInvocations?.map((toolInvocation) => {
                  const { toolName, toolCallId, state } = toolInvocation;

                  if (state === "result") {
                    if (toolName === "getEventsForSemester") {
                      const { result } = toolInvocation;
                      return (
                        <div
                          key={toolCallId}
                          className="overflow-hidden flex flex-col gap-2 border rounded-lg p-3"
                        >
                          <p className="text-2xl font-semibold mb-2">Events</p>
                          <div className="flex flex-col gap-2">
                            {result.events.map(
                              (event: {
                                id: string;
                                name: string;
                                type: string;
                                semesterId: string;
                              }) => (
                                <div key={event.id} className="">
                                  {event.name}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    }
                    if (toolName === "listSemesters") {
                      const { result } = toolInvocation;
                      return (
                        <div
                          key={toolCallId}
                          className="overflow-hidden flex flex-col gap-2 border rounded-lg p-3"
                        >
                          <p className="text-2xl font-semibold mb-2">
                            Semesters
                          </p>
                          <div className="flex flex-col gap-2">
                            {result.semesters.map(
                              (semester: {
                                id: string;
                                term: string;
                                year: string;
                              }) => (
                                <div
                                  key={semester.id}
                                  className="flex justify-between items-center gap-x-3"
                                >
                                  <p className="text-lg font-semibold">{`${semester.year} ${semester.term}`}</p>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      append({
                                        role: "system",
                                        content: `Get events for ${semester.id} semester.`,
                                      })
                                    }
                                  >
                                    Events
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    }
                  } else {
                    return (
                      <div key={toolCallId}>
                        {toolName === "displayWeather" ? (
                          <div>Loading weather...</div>
                        ) : toolName === "getStockPrice" ? (
                          <div>Loading stock price...</div>
                        ) : (
                          <div>Loading...</div>
                        )}
                      </div>
                    );
                  }
                })} */}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} className="h-0 w-0"></div>
      </div>

      <div className="pb-8 pt-2 inset-x-0 bottom-0 flex justify-center items-center bg-background">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-[1280px] gap-x-3 flex items-center justify-center"
        >
          <Textarea
            value={input}
            rows={1}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />

          <div className="absolute bottom-2 right-3 flex gap-x-1">
            <Button className="p-1 aspect-square size-8">
              <SendHorizonal className="size-3" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
