import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SendHorizonal } from "lucide-react";

export default function ChatInput({
  handleInputChange,
  input,
}: {
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  return (
    <>
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          handleInputChange(e);
          adjustHeight();
        }}
        placeholder="Type a message..."
        className="min-h-[24px] max-h-[calc(75dvh)] resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey === false && "form" in e.target) {
            e.preventDefault();
            (e.target.form as HTMLFormElement).requestSubmit();
            adjustHeight();
          }
        }}
      />

      <div className="absolute bottom-2 right-3 flex gap-x-1">
        <Button className="p-1 aspect-square size-8">
          <SendHorizonal className="size-3" />
        </Button>
      </div>
    </>
  );
}
