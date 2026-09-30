import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../../lib/utils";

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
}

export const CopyButton = ({ value, className, size = "icon-xs", ...props }: CopyButtonProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      onClick={handleCopy}
      data-state={copied ? "copied" : "idle"}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      title={copied ? "Copied" : "Copy to clipboard"}
      className={cn("size-7 [&_svg]:size-3.5", className)}
      {...props}
    >
      {copied ? (
        <Check className="text-emerald-400" aria-hidden />
      ) : (
        <Copy aria-hidden />
      )}
    </Button>
  );
};
