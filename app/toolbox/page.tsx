"use client"
import Image from "next/image"
import {
  MessageSquare,
  BookOpen,
  StickyNote,
  ChevronDown,
  MessageCircle,
  Search,
  Wrench,
  User,
  Settings,
  Leaf,
  Flower2,
  TestTube2,
  CloudSun,
  Recycle,
  Thermometer,
  CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import Link from "next/link"
import { useState } from "react"

// Sample conversation history
const conversationHistory = [
  {
    id: 1,
    title: "Best time to plant tomatoes?",
    date: "Today",
    preview: "Probiotic Gardener, when should I plant my tomatoes...",
  },
]

// AI Tools data
const aiTools = [
  {
    Icon: Flower2,
    name: "Plant Identifier",
    description: "Upload a photo to identify plants, flowers, and trees with AI.",
    href: "#", // Placeholder link
    cta: "Identify Plant",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-soilKingLightGreen/30 to-soilKingDarkGreen/30">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-soilKingLightGreen/40 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-soilKingDarkGreen/40 blur-2xl" />
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: TestTube2,
    name: "Soil Analyzer",
    description: "Get insights into your soil composition and recommendations for amendments.",
    href: "#", // Placeholder link
    cta: "Analyze Soil",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-soilKingBrown/30 to-orange-500/20">
        {" "}
        {/* Using orange as an earthy accent */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-soilKingBrown/40 blur-xl" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-orange-500/30 blur-xl" />
      </div>
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: CloudSun,
    name: "Garden Weather",
    description: "Localized weather forecasts and planting condition alerts for your garden.",
    href: "#", // Placeholder link
    cta: "Check Weather",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-600/20">
        {" "}
        {/* Keeping weather colors */}
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-400/30 blur-lg" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-cyan-600/30 blur-lg" />
      </div>
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Recycle,
    name: "Compost Calculator",
    description: "Calculate the right green-to-brown ratio for your compost pile.",
    href: "#", // Placeholder link
    cta: "Calculate Compost",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-soilKingDarkGreen/20 to-soilKingBrown/20">
        <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-soilKingDarkGreen/30 blur-xl" />
        <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-soilKingBrown/30 blur-xl" />
      </div>
    ),
    className: "lg:row-start-3 lg:row-end-4 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: CalendarDays,
    name: "Planting Calendar",
    description: "Personalized planting and harvesting calendar based on your location and selected plants.",
    href: "#",
    cta: "View Calendar",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-soilKingLightGreen/20 to-green-600/20">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-soilKingLightGreen/30 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-green-600/30 blur-2xl" />
      </div>
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Thermometer,
    name: "Pest & Disease ID",
    description: "Identify common garden pests and diseases and get organic treatment options.",
    href: "#",
    cta: "Diagnose Issue",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-600/20">
        {" "}
        {/* Warning colors */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-400/30 blur-xl" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-orange-600/30 blur-xl" />
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
]

export default function ToolboxPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTools = aiTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar (similar to notes page, update active link) */}
      <aside className="w-64 bg-background border-r border-input flex flex-col">
        <div className="p-4 border-b border-input">
          <div className="flex items-center gap-2">
            <Image
              src="/images/probiotic-gardener-logo.png"
              alt="Soil King AI Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <h1 className="text-lg font-semibold text-foreground">
              Soil King <span className="text-primary">AI</span>
            </h1>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Link href="/" className="block">
              <div className="px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition cursor-pointer">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} />
                  <span className="text-sm">AI Gardener</span>
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
              <div className="px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30">
                <div className="flex items-center gap-2">
                  <Wrench size={18} />
                  <span className="text-sm font-medium">Gardening AI Tools</span>
                </div>
              </div>
            </Link>
          </div>
          {/* Conversation History section */}
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 py-2 text-muted-foreground">
              <span className="text-xs font-medium uppercase">Chat History</span>
              <ChevronDown size={14} />
            </div>
            <div className="space-y-1 mt-2">
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
        <div className="p-4 border-t border-input">
          <Card className="p-3 bg-secondary dark:bg-secondary/80 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Big Rootz Soil</span>
            </div>
            <p className="text-xs text-foreground/80 mb-2">🌿 The secret to a thriving garden!</p>
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
              Get Yours Today
            </Button>
          </Card>
        </div>
        <div className="p-4">
          <Button variant="outline" size="sm" className="w-full text-muted-foreground border-input hover:bg-muted/50">
            <MessageCircle size={16} className="mr-2" />
            Send Feedback
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gardening AI Toolbox</h2>
            <p className="text-sm text-muted-foreground">
              Smart tools for your best garden yet, powered by Probiotic Gardener
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings size={18} />
            </Button>
            <Avatar className="h-8 w-8 bg-muted">
              <AvatarFallback className="text-muted-foreground">
                <User size={16} />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pb-4 border-b border-input">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search gardening tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="flex-1 overflow-auto p-6">
          <BentoGrid className="lg:grid-rows-3 max-w-6xl mx-auto">
            {filteredTools.map((tool) => (
              <BentoCard key={tool.name} {...tool} />
            ))}
          </BentoGrid>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tools found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-input bg-background px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            Powered by{" "}
            <a
              href="https://thesoilking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline uppercase"
            >
              The Soil King
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
