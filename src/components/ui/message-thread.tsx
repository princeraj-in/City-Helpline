import * as React from "react";
import {
  ArrowDown,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { CopyButton } from "./message-thread-utils/copy-button";
import { Button } from "./message-thread-utils/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

export type MessageRole = "user" | "assistant" | "system";
export type MessageToolCallStatus = "running" | "done" | "error";

interface MessageThreadContextValue {
  atBottom: boolean;
  scrollToBottom: () => void;
}

const MessageThreadContext =
  React.createContext<MessageThreadContextValue | null>(null);

export const useMessageThread = () => {
  const context = React.useContext(MessageThreadContext);
  if (!context) {
    throw new Error(
      "MessageThread parts must be rendered inside <MessageThread>.",
    );
  }

  return context;
};

const prefersReducedMotion = () => {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

export interface MessageThreadProps extends React.ComponentProps<"div"> {
  /** Keep the newest message in view while content streams in. */
  follow?: boolean;
  /** How close to the bottom (px) still counts as "at the bottom". */
  threshold?: number;
}

export const MessageThread = ({
  follow = true,
  threshold = 48,
  className,
  children,
  ...props
}: MessageThreadProps) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const pinnedRef = React.useRef(true);
  const autoScrollingRef = React.useRef(false);
  const [atBottom, setAtBottom] = React.useState(true);

  const scrollToBottom = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    pinnedRef.current = true;
    autoScrollingRef.current = true;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const onScroll = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const pinned = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    if (autoScrollingRef.current) {
      if (!pinned) return;
      autoScrollingRef.current = false;
    }
    pinnedRef.current = pinned;
    setAtBottom(pinned);
  }, [threshold]);

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content || !follow) return;
    viewport.scrollTop = viewport.scrollHeight;
    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) viewport.scrollTop = viewport.scrollHeight;
    });
    observer.observe(content);

    return () => observer.disconnect();
  }, [follow]);

  const context = React.useMemo(
    () => ({ atBottom, scrollToBottom }),
    [atBottom, scrollToBottom],
  );

  return (
    <MessageThreadContext.Provider value={context}>
      <div
        ref={viewportRef}
        data-slot="message-thread"
        role="log"
        aria-live="polite"
        onScroll={onScroll}
        className={cn(
          "relative flex flex-col overflow-y-auto overscroll-contain",
          className,
        )}
        {...props}
      >
        <div
          ref={contentRef}
          data-slot="message-thread-content"
          className="flex flex-col gap-6 p-4 sm:p-6"
        >
          {children}
        </div>
      </div>
    </MessageThreadContext.Provider>
  );
};

export type MessageThreadScrollButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
>;

export const MessageThreadScrollButton = ({
  className,
  children = "Jump to latest",
  ...props
}: MessageThreadScrollButtonProps) => {
  const { atBottom, scrollToBottom } = useMessageThread();
  if (atBottom) return null;

  return (
    <div
      data-slot="message-thread-scroll-button"
      className="sticky bottom-4 z-10 -mt-6 flex h-0 justify-center overflow-visible"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={scrollToBottom}
        className={cn("-translate-y-full bg-slate-900/90 text-white border-white/20 shadow-xl", className)}
        {...props}
      >
        <ArrowDown className="size-3.5" aria-hidden />
        {children}
      </Button>
    </div>
  );
};

const MessageRoleContext = React.createContext<MessageRole>("assistant");

export interface MessageProps extends React.ComponentProps<"div"> {
  role?: MessageRole;
}

export const Message = ({ role = "assistant", className, ...props }: MessageProps) => {
  return (
    <MessageRoleContext.Provider value={role}>
      <div
        data-slot="message"
        data-role={role}
        className={cn(
          "group/message flex w-full items-start gap-3",
          role === "user" && "flex-row-reverse",
          role === "system" && "justify-center",
          className,
        )}
        {...props}
      />
    </MessageRoleContext.Provider>
  );
};

export type MessageBodyProps = React.ComponentProps<"div">;

export const MessageBody = ({ className, ...props }: MessageBodyProps) => {
  const role = React.useContext(MessageRoleContext);

  return (
    <div
      data-slot="message-body"
      className={cn(
        "flex min-w-0 flex-col gap-1.5",
        role === "user" && "max-w-[85%] items-end",
        role === "assistant" && "flex-1 items-start",
        role === "system" && "items-center",
        className,
      )}
      {...props}
    />
  );
};

export type MessageAvatarProps = React.ComponentProps<"span">;

export const MessageAvatar = ({
  className,
  children,
  ...props
}: MessageAvatarProps) => {
  const role = React.useContext(MessageRoleContext);

  return (
    <span
      data-slot="message-avatar"
      aria-hidden
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium select-none",
        role === "assistant"
          ? "border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
          : "bg-purple-950/60 border border-purple-500/30 text-purple-300",
        className,
      )}
      {...props}
    >
      {children ??
        (role === "assistant" ? <Sparkles className="size-3.5" /> : null)}
    </span>
  );
};

export type MessageContentProps = React.ComponentProps<"div">;

export const MessageContent = ({ className, ...props }: MessageContentProps) => {
  const role = React.useContext(MessageRoleContext);

  return (
    <div
      data-slot="message-content"
      className={cn(
        "text-sm leading-relaxed break-words text-white [&_p+p]:mt-3",
        role === "user" && "rounded-2xl rounded-ee-sm bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border border-cyan-500/30 px-4 py-2.5 shadow-md",
        role === "assistant" && "bg-slate-900/60 border border-white/10 rounded-2xl px-4 py-3 shadow-md",
        role === "system" &&
          "rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-xs text-gray-400 uppercase",
        className,
      )}
      {...props}
    />
  );
};

export interface MessageActionsProps extends React.ComponentProps<"div"> {
  alwaysVisible?: boolean;
}

export const MessageActions = ({
  alwaysVisible = false,
  className,
  ...props
}: MessageActionsProps) => {
  return (
    <div
      data-slot="message-actions"
      role="toolbar"
      aria-label="Message actions"
      className={cn(
        "flex items-center gap-0.5 transition-opacity duration-150 motion-reduce:transition-none text-gray-300",
        !alwaysVisible &&
          "h-0 overflow-hidden opacity-0 group-hover/message:h-auto group-hover/message:opacity-100 focus-within:h-auto focus-within:opacity-100 has-[[aria-pressed=true]]:h-auto has-[[aria-pressed=true]]:opacity-100 has-[[data-state=copied]]:h-auto has-[[data-state=copied]]:opacity-100 pointer-coarse:h-auto pointer-coarse:opacity-100",
        className,
      )}
      {...props}
    />
  );
};

export interface MessageActionProps extends Omit<
  React.ComponentProps<typeof Button>,
  "type"
> {
  label: string;
  pressed?: boolean;
}

export const MessageAction = ({
  label,
  pressed,
  className,
  children,
  ...props
}: MessageActionProps) => {
  return (
    <Button
      type="button"
      data-slot="message-action"
      variant={pressed ? "secondary" : "ghost"}
      size="icon-xs"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={cn("size-7 [&_svg:not([class*='size-'])]:size-3.5 text-gray-400 hover:text-white", className)}
      {...props}
    >
      {children}
    </Button>
  );
};

export type MessageTimestampProps = React.ComponentProps<"time">;

export const MessageTimestamp = ({ className, ...props }: MessageTimestampProps) => {
  return (
    <time
      data-slot="message-timestamp"
      className={cn(
        "px-1 text-[10px] text-gray-400 tabular-nums",
        className,
      )}
      {...props}
    />
  );
};

const toPretty = (value: unknown) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const TOOL_STATUS: Record<
  MessageToolCallStatus,
  { dot: string; label: string }
> = {
  running: {
    dot: "bg-[#00E5FF] animate-pulse motion-reduce:animate-none",
    label: "running",
  },
  done: { dot: "bg-emerald-400", label: "done" },
  error: { dot: "bg-red-400", label: "failed" },
};

interface ToolSectionProps {
  label: string;
  children: string;
}

const ToolSection = ({ label, children }: ToolSectionProps) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400 uppercase font-bold">{label}</span>
      <pre
        dir="ltr"
        className="overflow-x-auto rounded-md bg-black/40 p-2 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap text-cyan-300 border border-white/10"
      >
        {children}
      </pre>
    </div>
  );
};

export interface MessageToolCallProps extends Omit<
  React.ComponentProps<typeof Collapsible>,
  "children"
> {
  name: string;
  status?: MessageToolCallStatus;
  args?: unknown;
  result?: unknown;
  children?: React.ReactNode;
}

export const MessageToolCall = ({
  name,
  status = "done",
  args,
  result,
  className,
  children,
  ...props
}: MessageToolCallProps) => {
  const tone = TOOL_STATUS[status];

  return (
    <Collapsible
      data-slot="message-tool-call"
      data-status={status}
      className={cn("w-full max-w-xl", className)}
      {...props}
    >
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0E131F]">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="group/tool flex w-full items-center gap-2 px-3 py-2 text-start text-xs outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <span
              aria-hidden
              className={cn("size-2 shrink-0 rounded-full", tone.dot)}
            />
            <span className="truncate text-white font-medium">{name}</span>
            <span className="ms-auto shrink-0 text-xs text-gray-400 uppercase">
              {tone.label}
            </span>
            <ChevronDown
              className="size-3.5 shrink-0 text-gray-400 transition-transform group-data-[state=open]/tool:rotate-180 motion-reduce:transition-none"
              aria-hidden
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-3 border-t border-white/10 p-3 bg-black/20">
            {args !== undefined ? (
              <ToolSection label="Arguments">{toPretty(args)}</ToolSection>
            ) : null}
            {result !== undefined ? (
              <ToolSection label="Result">{toPretty(result)}</ToolSection>
            ) : null}
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export interface MessageReasoningProps extends Omit<
  React.ComponentProps<typeof Collapsible>,
  "children"
> {
  duration?: number;
  isThinking?: boolean;
  label?: React.ReactNode;
  children?: React.ReactNode;
}

export const MessageReasoning = ({
  duration,
  isThinking = false,
  label,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: MessageReasoningProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const text =
    label ??
    (isThinking
      ? "Thinking..."
      : duration != null
        ? `Thought for ${duration}s`
        : "Reasoning");

  return (
    <Collapsible
      data-slot="message-reasoning"
      data-thinking={isThinking || undefined}
      open={open}
      onOpenChange={(next) => {
        setInternalOpen(next);
        onOpenChange?.(next);
      }}
      className={cn("flex w-full max-w-xl flex-col", className)}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="inline-flex w-fit items-center gap-1.5 rounded-md py-1 ps-1 pe-2 text-xs text-cyan-400 outline-none hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
        >
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 transition-transform motion-reduce:transition-none",
              open ? "rotate-90" : "rtl:rotate-180",
            )}
            aria-hidden
          />
          <span
            className={cn(
              isThinking && "animate-pulse motion-reduce:animate-none",
            )}
          >
            {text}
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ms-2.5 border-s-2 border-cyan-500/40 py-1 ps-3 text-sm leading-relaxed text-gray-300 [&_p+p]:mt-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export type MessageStreamingCursorProps = React.ComponentProps<"span">;

export const MessageStreamingCursor = ({
  className,
  style,
  ...props
}: MessageStreamingCursorProps) => {
  return (
    <span
      data-slot="message-streaming-cursor"
      aria-hidden
      className={cn(
        "ms-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-pulse rounded-[1px] bg-[#00E5FF] align-baseline motion-reduce:animate-none",
        className,
      )}
      style={{ animationDuration: "1s", ...style }}
      {...props}
    />
  );
};

export interface MessageTypingProps extends React.ComponentProps<"div"> {
  label?: string;
}

export const MessageTyping = ({
  label = "Studolink AI Mitra is typing...",
  className,
  ...props
}: MessageTypingProps) => {
  return (
    <div
      data-slot="message-typing"
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white/[0.04] border border-white/10", className)}
      {...props}
    >
      <span className="text-xs text-gray-400 mr-1">{label}</span>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          aria-hidden
          className="size-1.5 animate-bounce rounded-full bg-[#00E5FF] motion-reduce:animate-none"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
};

export interface MessageSourcesProps extends React.ComponentProps<"div"> {
  label?: React.ReactNode;
}

export const MessageSources = ({
  label = "Sources",
  className,
  children,
  ...props
}: MessageSourcesProps) => {
  return (
    <div
      data-slot="message-sources"
      className={cn(
        "flex flex-wrap items-center gap-1.5 [counter-reset:source]",
        className,
      )}
      {...props}
    >
      {label ? (
        <span className="me-1 text-xs text-gray-400 uppercase font-bold">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
};

export type MessageSourceProps = React.ComponentProps<"a">;

export const MessageSource = ({
  className,
  children,
  ...props
}: MessageSourceProps) => {
  return (
    <a
      data-slot="message-source"
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] py-0.5 ps-1 pe-2.5 text-xs text-gray-200 transition-colors [counter-increment:source] hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="flex size-4 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-[#00E5FF] text-[10px] tabular-nums before:content-[counter(source)]"
      />
      <span className="truncate">{children}</span>
    </a>
  );
};

export default MessageThread;
