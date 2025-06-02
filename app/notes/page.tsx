"use client"
import { useState } from "react"
import Image from "next/image"
import {
  MessageSquare,
  BookOpen,
  StickyNote,
  ChevronDown,
  MessageCircle,
  Search,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Tag,
  User,
  Settings,
  Wrench,
  Leaf,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"

// Sample notes data
const notes = [
  {
    id: 1,
    title: "Spring Planting Schedule",
    content:
      "Plan for early spring: peas, spinach, lettuce. Mid-spring: tomatoes, peppers, beans. Ensure soil is prepared with Big Rootz Soil for best results.",
    tags: ["Spring", "Planting", "Vegetables"],
    category: "Planning",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-05",
    color: "green", // Corresponds to soilKingDarkGreen/LightGreen
  },
  {
    id: 2,
    title: "Compost Recipe Ideas",
    content:
      "Discussed with Probiotic Gardener: balance greens (nitrogen) and browns (carbon). Add coffee grounds, eggshells. Avoid meat and dairy.",
    tags: ["Compost", "Organic", "Soil Health"],
    category: "Soil",
    createdAt: "2024-03-02",
    updatedAt: "2024-03-02",
    color: "brown", // Corresponds to soilKingBrown
  },
  {
    id: 3,
    title: "Natural Pest Remedies",
    content:
      "Neem oil for aphids, diatomaceous earth for slugs. Companion planting: marigolds to deter nematodes. Probiotic Gardener suggested ladybugs.",
    tags: ["Pest Control", "Organic", "DIY"],
    category: "Maintenance",
    createdAt: "2024-02-28",
    updatedAt: "2024-03-01",
    color: "orange", // Can map to a lighter brown or a warm accent
  },
]

// Sample conversation history
const conversationHistory = [
  {
    id: 1,
    title: "Soil pH Balancing",
    date: "Today",
    preview: "My soil pH is too acidic, what can I do...",
  },
  { id: 2, title: "Tomato Blight Issues", date: "Yesterday", preview: "Help with identifying tomato blight..." },
]

export default function NotesPage() {
  // Renamed component
  // ... existing state: searchTerm, selectedCategory, sortBy ...
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("updated")

  const categories = ["all", "Planning", "Soil", "Maintenance", "Harvesting", "Pest Control"] // Updated categories
  // ... sortOptions (can remain same) ...

  // ... filteredNotes logic (can remain same) ...
  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || note.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const getColorClass = (color: string) => {
    const colorMap = {
      green: "border-l-soilKingDarkGreen bg-soilKingLightGreen/30 dark:bg-soilKingDarkGreen/20",
      brown: "border-l-soilKingBrown bg-soilKingBrown/20 dark:bg-soilKingBrown/10",
      orange: "border-l-orange-500 bg-orange-500/20 dark:bg-orange-500/10", // Keep orange or map to another theme color
      purple: "border-l-purple-500 bg-purple-500/20 dark:bg-purple-500/10", // Example, adjust as needed
      red: "border-l-red-500 bg-red-500/20 dark:bg-red-500/10", // Example, adjust as needed
    }
    return colorMap[color as keyof typeof colorMap] || "border-l-gray-500 bg-gray-50 dark:bg-gray-900/10"
  }

  // ... formatDate (can remain same) ...
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    })
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {" "}
      {/* Use theme colors */}
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-input flex flex-col">
        {" "}
        {/* Use theme colors */}
        {/* Header */}
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
        {/* Navigation */}
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
              <div className="px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30">
                <div className="flex items-center gap-2">
                  <StickyNote size={18} />
                  <span className="text-sm font-medium">Garden Notes</span>
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
        {/* Current Offers - Highlighted */}
        <div className="p-4 border-t border-input">
          <Card className="p-3 bg-secondary dark:bg-secondary/80 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Big Rootz Soil</span>
            </div>
            <p className="text-xs text-foreground/80 mb-2">🌿 Premium soil blend for thriving plants!</p>
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
              Learn More
            </Button>
          </Card>
        </div>
        {/* User Feedback Button */}
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
            <h2 className="text-2xl font-bold text-foreground">My Garden Notes</h2>
            <p className="text-sm text-muted-foreground">Insights and ideas from your Probiotic Gardener</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
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

        {/* Search and Filters */}
        <div className="px-6 pb-4 border-b border-input">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search garden notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px] bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {/* sortOptions need to be defined or imported */}
                  {[
                    { value: "updated", label: "Last Updated" },
                    { value: "created", label: "Date Created" },
                    { value: "title", label: "Title" },
                  ].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                className={`hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${getColorClass(note.color)} bg-background`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2 text-foreground">{note.title}</CardTitle>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Updated {formatDate(note.updatedAt)}</span>
                    <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                      {note.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{note.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No garden notes found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or create your first note!</p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create First Garden Note
              </Button>
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
