import * as React from "react";
import { cn } from "@/lib/utils";

interface EditableDivProps {
  placeholder?: string;
  onChange: (content: string) => void;
  className?: string;
  value?: string;
}

const EditableDiv = React.forwardRef<HTMLDivElement, EditableDivProps>(
  (
    { className, placeholder = "Enviar un mensaje", onChange, ...props },
    ref
  ) => {
    const [content, setContent] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const newContent = e.currentTarget.textContent || "";
      setContent(newContent);
      onChange(newContent);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
      }
    };

    return (
      <div className="flex grow flex-col gap-2">
        <div
          className={cn(
            "flex w-full items-center rounded border-2 px-2 transition-colors duration-200 ease-in-out",
            "border-gray-700 hover:border-gray-400",
            "focus-within:border-transparent focus-within:bg-[#070809] focus-within:outline-none focus-within:ring-1 focus-within:ring-[#F4F5F6] focus-within:ring-offset-1 focus-within:hover:border-transparent",
            className
          )}
        >
          <div className="relative w-full align-middle" dir="ltr">
            <div
              ref={ref}
              contentEditable
              role="textbox"
              spellCheck="true"
              onInput={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              className={cn(
                "flex items-center",
                "editor-input min-h-[40px] max-h-[200px] overflow-y-auto",
                "outline-none whitespace-pre-wrap break-words",
                "text-sm text-gray-900 dark:text-white"
              )}
              {...props}
            />
            {!content && !isFocused && (
              <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 select-none pl-[1px] text-sm font-medium leading-[1.15] text-[#768087]">
                {placeholder}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

EditableDiv.displayName = "EditableDiv";

export { EditableDiv };
