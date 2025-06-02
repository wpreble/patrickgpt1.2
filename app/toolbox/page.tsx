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
import { useIsMobile } from "@/hooks/use-mobile"

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
    href: "#",
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
    href: "#",
    cta: "Analyze Soil",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-soilKingBrown/30 to-orange-500/20">
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
    href: "#",
    cta: "Check Weather",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-yellow-500/20">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-500/30 blur-lg" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-yellow-500/30 blur-lg" />
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Recycle,
    name: "Compost Helper",
    description: "Learn what to compost, ratios, and troubleshooting for healthy compost.",
    href: "#",
    cta: "Start Composting",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-soilKingBrown/20">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-green-600/30 blur-lg" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-soilKingBrown/30 blur-lg" />
      </div>
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Thermometer,
    name: "pH Optimizer",
    description: "Test and adjust your soil pH for optimal plant health and nutrient uptake.",
    href: "#",
    cta: "Optimize pH",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-red-500/30 blur-lg" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-blue-500/30 blur-lg" />
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: CalendarDays,
    name: "Planting Calendar",
    description: "Get personalized planting schedules based on your location and climate zone.",
    href: "#",
    cta: "View Calendar",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-soilKingLightGreen/30 to-green-600/20">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-soilKingLightGreen/40 blur-lg" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-green-600/30 blur-lg" />
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
]

export default function ToolboxPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const isMobile = useIsMobile()

  const filteredTools = aiTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="border-b border-input bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-soilKingDarkGreen rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-soilKingCream" />
                </div>
                <span className="font-bold text-lg hidden sm:inline">Soil King AI</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Chat
                </Link>
                <Link href="/toolbox" className="text-sm font-medium text-primary">
                  Toolbox
                </Link>
                <Link href="/notes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Notes
                </Link>
                <Link href="/resource-library" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Avatar className="h-8 w-8">
                <AvatarFallback>PK</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-input px-4 py-2">
            <nav className="flex items-center justify-around">
              <Link href="/" className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                Chat
              </Link>
              <Link href="/toolbox" className="flex flex-col items-center gap-1 text-xs text-primary">
                <Wrench className="h-4 w-4" />
                Toolbox
              </Link>
              <Link href="/notes" className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                <StickyNote className="h-4 w-4" />
                Notes
              </Link>
              <Link href="/resource-library" className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                Resources
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">AI Toolbox</h1>
                <p className="text-muted-foreground">Powerful AI tools to help you succeed in gardening and agriculture</p>
              </div>

              <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 gap-4 sm:gap-6">
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
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-input bg-background px-4 sm:px-6 py-4">
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