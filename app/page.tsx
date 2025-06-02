"use client"

import type React from "react"

import { useState, type FormEvent, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChatInput } from "@/components/ui/chat-input"
import ChatHeader from "@/components/chat-header"
import MessagesArea from "@/components/messages-area"
import { Button } from "@/components/ui/button"
import {
  PanelRightOpen,
  PanelLeftOpen,
  MessageSquareIcon,
  Wrench,
  BookOpen,
  StickyNote,
  ChevronDown,
  ReplyIcon as FeedbackIcon,
  Plus,
  SlidersHorizontal,
  Mic,
  Send,
  GripVertical,
  PlusCircle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Leaf } from "lucide-react" // Or another relevant icon

const conversationHistory = [
  {
    id: 1,
    title: "Composting Techniques",
    date: "Today",
    preview: "What's the best way to start a compost pile...",
  },
  { id: 2, title: "Organic Pest Control", date: "Yesterday", preview: "How to deal with aphids organically..." },
  { id: 3, title: "Choosing Right Soil Mix", date: "2 days ago", preview: "I need soil for my vegetable garden..." },
  { id: 4, title: "Raised Bed Gardening", date: "3 days ago", preview: "Tips for building raised garden beds..." },
  { id: 5, title: "Seasonal Planting Guide", date: "Last week", preview: "What to plant in the fall season..." },
  { id: 6, title: "Understanding NPK Ratios", date: "Last week", preview: "Explaining NPK for fertilizers..." },
]

interface SecondaryMessage {
  id: number
  text: string
  sender: "user" | "assistant"
}

const MIN_SIDEBAR_WIDTH = 200
const MAX_LEFT_SIDEBAR_WIDTH = 400
const MAX_RIGHT_SIDEBAR_WIDTH = 640
const DEFAULT_SIDEBAR_WIDTH = 256
const DEFAULT_RIGHT_SIDEBAR_WIDTH = 384
const TABS_TO_DROPDOWN_THRESHOLD = 320

interface TabInfo {
  value: string
  label: string
}

const rightSidebarTabs: TabInfo[] = [
  { value: "nav", label: "NAV" },
  { value: "artifacts", label: "Artifacts" },
  { value: "secondary-chat", label: "Chat" },
]

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ id: number; content: string; role: "user" | "assistant"; timestamp?: Date }>
  >([]) // Start with empty messages
  const [inputValue, setInputValue] = useState("")

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [activeRightSidebarTab, setActiveRightSidebarTab] = useState(rightSidebarTabs[0].value) // Keep NAV as default or change
  const [activeNoteTab, setActiveNoteTab] = useState("note-1")
  const [notes, setNotes] = useState<{ id: string; title: string; content: string }[]>([
    { id: "note-1", title: "Garden Plan", content: "Spring planting ideas..." },
    { id: "note-2", title: "Soil Amendments", content: "Researching biochar..." },
  ])

  const [secondaryChatMessages, setSecondaryChatMessages] = useState<SecondaryMessage[]>([
    { id: 1, text: "Secondary assistant ready.", sender: "assistant" },
  ])
  const [secondaryChatInput, setSecondaryChatInput] = useState("")

  const [leftSidebarWidth, setLeftSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const isResizingLeftSidebar = useRef(false)
  const leftSidebarRef = useRef<HTMLElement>(null)

  const [rightSidebarWidth, setRightSidebarWidth] = useState(DEFAULT_RIGHT_SIDEBAR_WIDTH)
  const isResizingRightSidebar = useRef(false)
  const rightSidebarRef = useRef<HTMLElement>(null)

  const [showTabsAsDropdown, setShowTabsAsDropdown] = useState(false)
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null)
  const [isAssistantLoading, setIsAssistantLoading] = useState(false)

  const startNewConversation = () => {
    setMessages([])
    setInputValue("")
    setCurrentThreadId(null) // Reset thread ID
    setIsAssistantLoading(false) // Reset loading state
    // Optionally, reset other states like secondary chat or notes if needed
  }

  const handleSendMessage = async (value: string) => {
    if (value.trim() === "") return

    const newUserMessage = {
      id: Date.now(),
      content: value,
      role: "user" as "user" | "assistant",
      timestamp: new Date(),
    }
    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInputValue("") // Clear input immediately
    setIsAssistantLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: value,
          threadId: currentThreadId,
        }),
      })

      if (!response.ok) {
        let errorText = `API request failed with status ${response.status}`
        // Read the response body as text first. This consumes the stream.
        const responseBodyText = await response.text()
        try {
          // Attempt to parse the text as JSON.
          const errorData = JSON.parse(responseBodyText)
          errorText = errorData.error || errorData.message || JSON.stringify(errorData)
        } catch (e) {
          // If JSON parsing fails, use the raw text as the error message.
          errorText = responseBodyText || errorText
        }
        throw new Error(errorText)
      }

      // If response.ok is true, the body has not been read yet.
      // Read it as JSON.
      const data = await response.json()

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + 1,
          content: data.reply,
          role: "assistant" as "user" | "assistant",
          timestamp: new Date(),
        },
      ])
      setCurrentThreadId(data.threadId)
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + 1,
          content: `Sorry, I encountered an error. ${error instanceof Error ? error.message : "An unknown error occurred."}`,
          role: "assistant" as "user" | "assistant",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsAssistantLoading(false)
    }
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSendMessage(inputValue)
    setInputValue("")
  }

  const handleSecondaryChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (secondaryChatInput.trim() === "") return
    const newUserMessage: SecondaryMessage = {
      id: secondaryChatMessages.length + 1,
      text: secondaryChatInput,
      sender: "user",
    }
    setSecondaryChatMessages((prev) => [...prev, newUserMessage])
    setTimeout(() => {
      const aiResponse: SecondaryMessage = {
        id: secondaryChatMessages.length + 2 + Date.now(),
        text: `Secondary AI echoes: "${secondaryChatInput}"`,
        sender: "assistant",
      }
      setSecondaryChatMessages((prev) => [...prev, aiResponse])
    }, 500)
    setSecondaryChatInput("")
  }

  const startResizingLeftSidebar = useCallback((e: React.MouseEvent) => {
    isResizingLeftSidebar.current = true
    e.preventDefault()
  }, [])

  const stopResizingSidebars = useCallback(() => {
    isResizingLeftSidebar.current = false
    isResizingRightSidebar.current = false
  }, [])

  const resizeLeftSidebar = useCallback((e: MouseEvent) => {
    if (isResizingLeftSidebar.current && leftSidebarRef.current) {
      const newWidth = e.clientX
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_LEFT_SIDEBAR_WIDTH) {
        setLeftSidebarWidth(newWidth)
      } else if (newWidth < MIN_SIDEBAR_WIDTH) {
        setLeftSidebarWidth(MIN_SIDEBAR_WIDTH)
      } else {
        setLeftSidebarWidth(MAX_LEFT_SIDEBAR_WIDTH)
      }
    }
  }, [])

  const startResizingRightSidebar = useCallback((e: React.MouseEvent) => {
    isResizingRightSidebar.current = true
    e.preventDefault()
  }, [])

  const resizeRightSidebar = useCallback((e: MouseEvent) => {
    if (isResizingRightSidebar.current && rightSidebarRef.current) {
      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_RIGHT_SIDEBAR_WIDTH) {
        setRightSidebarWidth(newWidth)
      } else if (newWidth < MIN_SIDEBAR_WIDTH) {
        setRightSidebarWidth(MIN_SIDEBAR_WIDTH)
      } else {
        setRightSidebarWidth(MAX_RIGHT_SIDEBAR_WIDTH)
      }
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      resizeLeftSidebar(e)
      resizeRightSidebar(e)
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", stopResizingSidebars)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", stopResizingSidebars)
    }
  }, [resizeLeftSidebar, resizeRightSidebar, stopResizingSidebars])

  useEffect(() => {
    setShowTabsAsDropdown(rightSidebarWidth < TABS_TO_DROPDOWN_THRESHOLD)
  }, [rightSidebarWidth])

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <aside
        ref={leftSidebarRef}
        style={{ width: isLeftSidebarOpen ? `${leftSidebarWidth}px` : "0px" }}
        className={cn(
          "bg-background border-r border-input flex flex-col transition-width duration-0 ease-in-out",
          !isLeftSidebarOpen && "opacity-0 pointer-events-none",
        )}
      >
        {isLeftSidebarOpen && (
          <>
            <div className="p-4 border-b border-input flex items-center justify-between sticky top-0 bg-background z-10 flex-shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <Image
                  src="/images/probiotic-gardener-logo.png" // Updated logo
                  alt="Soil King AI Logo"
                  width={32}
                  height={32}
                  className="flex-shrink-0 rounded-full"
                />
                <h1 className="text-lg font-semibold text-foreground truncate">
                  Soil King <span className="text-primary">AI</span> {/* Updated title */}
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLeftSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <PanelLeftOpen size={20} />
              </Button>
            </div>
            <nav className="flex-1 flex flex-col p-4 min-h-0">
              <div className="space-y-2 flex-shrink-0">
                <Link href="/" className="block">
                  <div className="px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30">
                    <div className="flex items-center gap-2">
                      <MessageSquareIcon size={18} />
                      <span className="text-sm font-medium">AI Gardener</span>
                    </div>
                  </div>
                </Link>
                <Link href="/resource-library" className="block">
                  <div className="px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <BookOpen size={18} />
                      <span className="text-sm">Gardening Resources</span>
                    </div>
                  </div>
                </Link>
                <Link href="/notes" className="block">
                  <div className="px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <StickyNote size={18} />
                      <span className="text-sm">Garden Notes</span>
                    </div>
                  </div>
                </Link>
                <Link href="/toolbox" className="block">
                  <div className="px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Wrench size={18} />
                      <span className="text-sm">Gardening AI Tools</span>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="mt-6 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between px-3 py-2 text-muted-foreground flex-shrink-0">
                  <span className="text-xs font-medium uppercase">Chat History</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={startNewConversation}
                    className="text-muted-foreground hover:text-foreground h-6 w-6"
                  >
                    <PlusCircle size={16} />
                    <span className="sr-only">New Chat</span>
                  </Button>
                </div>
                <div className="space-y-1 mt-2 overflow-y-auto flex-grow">
                  {conversationHistory.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition cursor-pointer"
                    >
                      <div className="text-sm font-medium truncate">{conversation.title}</div>
                      <div className="text-xs text-muted-foreground/80">{conversation.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </nav>
            <div className="p-4 border-t border-input sticky bottom-0 bg-background z-10 flex-shrink-0">
              <Card className="p-3 bg-secondary dark:bg-secondary/80 border-primary/20">
                {" "}
                {/* Updated card style */}
                <div className="flex items-center gap-2 mb-2">
                  <Leaf size={16} className="text-primary" /> {/* Updated icon */}
                  <span className="text-sm font-semibold text-primary">Featured Product</span>
                </div>
                <p className="text-xs text-foreground/80 mb-2">
                  🌿 Big Rootz Soil - Give your plants the best foundation!
                </p>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
                  Shop Now
                </Button>
              </Card>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-muted-foreground border-input hover:bg-muted/50"
                >
                  <FeedbackIcon size={16} className="mr-2" />
                  Send Feedback
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Left Sidebar Resizer & Toggle Button ... (keep as is) ... */}
      {isLeftSidebarOpen && (
        <div
          onMouseDown={startResizingLeftSidebar}
          className="w-1.5 cursor-col-resize bg-transparent hover:bg-muted-foreground/20 transition-colors duration-200 flex items-center justify-center group flex-shrink-0"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-200" />
        </div>
      )}

      {!isLeftSidebarOpen && (
        <div className="fixed top-4 left-4 z-30">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsLeftSidebarOpen(true)}
            className="rounded-md p-2 h-10 w-10 bg-background hover:bg-muted/50 shadow-md border-input"
            aria-label="Open navigation panel"
          >
            <PanelRightOpen size={18} className="text-muted-foreground" />
          </Button>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full pt-0">
          <ChatHeader />
          <MessagesArea messages={messages} isLoading={isAssistantLoading} />
          <div className="p-4 border-t-0 bg-transparent">
            <form
              onSubmit={handleFormSubmit}
              className="bg-muted/50 dark:bg-gray-700 rounded-2xl shadow-lg flex items-center p-2 space-x-2"
            >
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Plus size={20} />
                <span className="sr-only">Add</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <SlidersHorizontal size={20} />
                <span className="sr-only">Tools</span>
              </Button>
              <ChatInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Probiotic Gardener..." // Updated placeholder
                className="min-h-10 flex-1 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 px-2 py-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleFormSubmit(e as any)
                  }
                }}
              />
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Mic size={20} />
                <span className="sr-only">Voice input</span>
              </Button>
              <Button
                type="submit"
                size="icon"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-8 h-8" // Ensure this uses new theme
              >
                <Send size={16} />
                <span className="sr-only">Send</span>
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by{" "}
              <a
                href="https://thesoilking.com/" // Updated link
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline uppercase"
              >
                The Soil King {/* Updated text */}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar Resizer & Toggle Button ... (keep as is) ... */}
      {isRightSidebarOpen && (
        <div
          onMouseDown={startResizingRightSidebar}
          className="w-1.5 cursor-col-resize bg-transparent hover:bg-muted-foreground/20 transition-colors duration-200 flex items-center justify-center group flex-shrink-0"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-200" />
        </div>
      )}
      {!isRightSidebarOpen && (
        <div className="fixed top-4 right-4 z-30">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsRightSidebarOpen(true)}
            className="rounded-md p-2 h-10 w-10 bg-background hover:bg-muted/50 shadow-md border-input"
            aria-label="Open context panel"
          >
            <PanelLeftOpen size={18} className="text-muted-foreground" />{" "}
            {/* Changed from PanelRightOpen to PanelLeftOpen for consistency */}
          </Button>
        </div>
      )}

      <aside
        ref={rightSidebarRef}
        style={{ width: isRightSidebarOpen ? `${rightSidebarWidth}px` : "0px" }}
        className={cn(
          "bg-background border-l border-input flex flex-col transition-width duration-0 ease-in-out",
          !isRightSidebarOpen && "opacity-0 pointer-events-none",
        )}
      >
        {isRightSidebarOpen && (
          <div className="flex flex-col h-full overflow-hidden">
            <Tabs
              value={activeRightSidebarTab}
              onValueChange={setActiveRightSidebarTab}
              className="flex flex-col flex-grow min-h-0"
            >
              <div className="flex items-center justify-between sticky top-0 bg-background z-10 p-4 border-b border-input flex-shrink-0">
                {showTabsAsDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex-grow justify-between text-xs">
                        {rightSidebarTabs.find((tab) => tab.value === activeRightSidebarTab)?.label || "Select Tab"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                      {rightSidebarTabs.map((tab) => (
                        <DropdownMenuItem
                          key={tab.value}
                          onSelect={() => setActiveRightSidebarTab(tab.value)}
                          className="text-xs"
                        >
                          {tab.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <TabsList className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-lg flex-grow">
                    {rightSidebarTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="text-xs px-2 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRightSidebarOpen(false)}
                  className="text-muted-foreground hover:text-foreground ml-2 flex-shrink-0"
                >
                  <PanelRightOpen size={20} />
                </Button>
              </div>

              <div className="flex-grow overflow-y-auto">
                <TabsContent value="nav" className="flex flex-col p-4 h-full">
                  <div className="flex-grow-[2] overflow-y-auto mb-4 p-2 border border-input rounded-md bg-muted/30">
                    <h4 className="text-sm font-medium mb-2 text-foreground">Probiotic Gardener Context</h4>{" "}
                    {/* Updated title */}
                    <ol className="list-decimal list-inside text-xs space-y-1 text-muted-foreground">
                      <li>Soil Health Principles</li> {/* Updated item */}
                      <li>Organic Gardening Tips</li> {/* Updated item */}
                      <li>Big Rootz Soil Info</li>
                    </ol>
                  </div>
                  <div
                    className="flex-grow-[1] flex flex-col border border-input rounded-lg bg-muted/30 min-h-0"
                    style={{ flexBasis: "33.33%" }}
                  >
                    <h3 className="text-sm font-medium text-muted-foreground p-2 border-b border-input shrink-0">
                      Garden Notes
                    </h3>
                    <Tabs
                      value={activeNoteTab}
                      onValueChange={setActiveNoteTab}
                      className="flex-1 flex flex-col min-h-0"
                    >
                      <TabsList className="p-1 bg-muted rounded-t-md rounded-b-none shrink-0">
                        {notes.map((note) => (
                          <TabsTrigger
                            key={note.id}
                            value={note.id}
                            className="text-xs px-2 py-1 data-[state=active]:bg-background"
                          >
                            {note.title}
                          </TabsTrigger>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newNoteId = `note-${notes.length + 1}`
                            setNotes([
                              ...notes,
                              { id: newNoteId, title: `Garden Note ${notes.length + 1}`, content: "" },
                            ])
                            setActiveNoteTab(newNoteId)
                          }}
                          className="ml-auto text-xs px-2 text-muted-foreground hover:text-foreground"
                        >
                          + Add
                        </Button>
                      </TabsList>
                      {notes.map((note) => (
                        <TabsContent key={note.id} value={note.id} className="flex-1 mt-0 rounded-b-md overflow-hidden">
                          <Textarea
                            placeholder={`Type your ${note.title.toLowerCase()} here...`}
                            value={note.content}
                            onChange={(e) => {
                              setNotes(notes.map((n) => (n.id === note.id ? { ...n, content: e.target.value } : n)))
                            }}
                            className="h-full w-full resize-none border-0 focus-visible:ring-0 bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground"
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </TabsContent>
                <TabsContent value="artifacts" className="flex flex-col p-4 h-full">
                  <div className="border border-input rounded-md bg-muted/30 flex-grow flex flex-col p-4">
                    <h4 className="text-sm font-medium mb-2 text-foreground shrink-0">Gardening Guides</h4>
                    <p className="text-xs text-muted-foreground mb-2 shrink-0">
                      Generated guides and soil reports will appear here.
                    </p>
                    <div className="flex-grow p-4 border border-dashed border-input/50 rounded-md bg-background">
                      <p className="text-center text-muted-foreground">Document content will appear here.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="secondary-chat" className="flex flex-col p-4 h-full">
                  <div className="border border-input rounded-md bg-muted/30 flex-grow flex flex-col p-4">
                    <h4 className="text-sm font-medium mb-2 text-foreground shrink-0">Quick Soil Tips</h4>
                    <div className="flex-grow border border-input rounded-md p-2 bg-background mb-2 overflow-y-auto space-y-2">
                      {secondaryChatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "p-2 rounded-lg text-xs max-w-[80%]",
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground self-end ml-auto"
                              : "bg-muted text-muted-foreground self-start mr-auto",
                          )}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSecondaryChatSubmit} className="flex items-center space-x-2 shrink-0">
                      <Textarea
                        placeholder="Ask a quick question..."
                        value={secondaryChatInput}
                        onChange={(e) => setSecondaryChatInput(e.target.value)}
                        className="text-xs h-16 resize-none flex-grow bg-background border-input placeholder:text-muted-foreground"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSecondaryChatSubmit(e as any)
                          }
                        }}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Send
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </aside>
    </div>
  )
}
