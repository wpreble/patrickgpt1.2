import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble"
import { Leaf } from "lucide-react" // Using Leaf as an example
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Message {
  id: number
  content: string
  role: "user" | "assistant"
  timestamp?: Date
}

interface MessagesAreaProps {
  messages: Message[]
  isLoading?: boolean
}

export default function MessagesArea({ messages, isLoading }: MessagesAreaProps) {
  const currentQuote =
    "Probiotic farming.... What's good for the soil is good for the tummy.... Know your farmer, know your product manufacturer, know your analytics and testing."
  const quoteAuthor = "Patrick King (The Soil King)"

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 flex flex-col min-h-0">
      {messages.length === 0 && !isLoading && (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-6 md:py-12 px-4">
          <div className="mb-6">
            <Image
              src="/images/probiotic-gardener-logo.png"
              alt="Probiotic Gardener"
              width={48}
              height={48}
              className="mx-auto mb-4 rounded-full md:w-16 md:h-16"
            />
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">Welcome to Soil King AI</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6">Ask the Probiotic Gardener anything about soil and gardening!</p>
          </div>
          <Card className="p-3 md:p-6 bg-secondary text-secondary-foreground border-primary/20 max-w-full md:max-w-2xl mx-auto w-full">
            <div className="flex items-start space-x-3">
              <Leaf className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm sm:text-base text-left italic">"{currentQuote}"</p>
                <p className="text-xs text-muted-foreground text-right mt-2">- {quoteAuthor}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
      {messages.map((message) => (
        <ChatBubble key={message.id} variant={message.role === "user" ? "sent" : "received"}>
          {message.role === "assistant" && (
            <ChatBubbleAvatar
              src="/images/probiotic-gardener-logo.png"
              className="h-8 w-8 bg-secondary text-primary flex items-center justify-center rounded-full"
              fallback="PG"
            />
          )}
          <ChatBubbleMessage variant={message.role === "user" ? "sent" : "received"}>
            <p className="text-sm leading-relaxed">{message.content}</p>
            {message.timestamp && (
              <p className="text-xs mt-2 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </ChatBubbleMessage>
          {message.role === "user" && (
            <ChatBubbleAvatar
              className="h-8 w-8 bg-muted text-muted-foreground flex items-center justify-center"
              fallback="U"
            />
          )}
        </ChatBubble>
      ))}
      {isLoading && (
        <ChatBubble variant="received">
          <ChatBubbleAvatar
            src="/images/probiotic-gardener-logo.png"
            className="h-8 w-8 bg-secondary text-primary flex items-center justify-center rounded-full"
            fallback="PG"
          />
          <ChatBubbleMessage isLoading />
        </ChatBubble>
      )}
    </div>
  )
}
