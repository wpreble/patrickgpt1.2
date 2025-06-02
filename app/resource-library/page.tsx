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
  FileText,
  Clock,
  User,
  Settings,
  Wrench,
  Linkedin,
  Twitter,
  GlobeIcon,
  Leaf,
  Youtube,
  FileQuestion,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Sample resource data
const resources = [
  {
    id: 1,
    title: "Organic Composting Guide",
    type: "video",
    duration: "30 min",
    category: "Soil Health",
    description: "Learn how to create nutrient-rich compost for your garden from kitchen scraps and yard waste.",
    thumbnail: "/placeholder.svg?width=300&height=169",
    author: "Patrick King",
    difficulty: "Beginner",
    tags: ["Compost", "Organic", "Soil"],
  },
  {
    id: 2,
    title: "Raised Bed Construction Manual",
    type: "document",
    category: "Garden Setup",
    description: "A step-by-step guide to building durable and productive raised garden beds.",
    thumbnail: "/placeholder.svg?width=300&height=169",
    author: "Soil King Team",
    difficulty: "Intermediate",
    tags: ["Raised Beds", "DIY", "Gardening"],
  },
  {
    id: 3,
    title: "Understanding Soil pH & Nutrients",
    type: "article", // New type
    category: "Soil Science",
    description: "Explore the importance of soil pH and essential nutrients for healthy plant growth.",
    thumbnail: "/placeholder.svg?width=300&height=169",
    author: "Dr. Earthwell",
    difficulty: "Advanced",
    tags: ["Soil pH", "Nutrients", "Plant Health"],
  },
]

// Sample conversation history
const conversationHistory = [
  {
    id: 1,
    title: "Choosing Fertilizers",
    date: "Today",
    preview: "What organic fertilizers do you recommend...",
  },
]

export default function ResourceLibraryPage() {
  // Renamed component
  // ... existing state: searchTerm, selectedCategory, selectedDifficulty ...
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const categories = ["all", "Soil Health", "Garden Setup", "Plant Care", "Pest Control", "Harvesting", "Soil Science"] // Updated
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"]

  // ... filteredResources logic ...
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.tags && resource.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || resource.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Youtube className="h-4 w-4" /> // Changed to Youtube
      case "document":
        return <FileText className="h-4 w-4" />
      case "article":
        return <FileQuestion className="h-4 w-4" /> // Changed to FileQuestion
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-soilKingLightGreen/50 text-soilKingDarkGreen dark:bg-soilKingLightGreen/20 dark:text-soilKingLightGreen"
      case "Intermediate":
        return "bg-yellow-400/30 text-yellow-700 dark:bg-yellow-600/20 dark:text-yellow-400" // Keep yellow or map
      case "Advanced":
        return "bg-red-400/30 text-red-700 dark:bg-red-600/20 dark:text-red-400" // Keep red or map
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Left Sidebar (similar to notes page, update active link) */}
      <aside className="w-64 bg-background border-r border-input flex flex-col flex-shrink-0">
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
        <nav className="flex-1 p-4 overflow-y-auto">
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
              <div className="px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  <span className="text-sm font-medium">Gardening Resources</span>
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
            <p className="text-xs text-foreground/80 mb-2">🌿 Premium soil for healthy, thriving plants!</p>
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
              Shop Now
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

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-background z-10 border-b border-input flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gardening Resource Library</h2>
            <p className="text-sm text-muted-foreground">Curated by The Soil King to help your garden thrive</p>
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

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-input flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search resources (e.g., 'compost', 'soil pH')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[160px] bg-background">
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
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-[140px] bg-background">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === "all" ? "All Levels" : difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content Area: Resources Grid + Brand Hub */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Resources Grid (Scrollable) */}
          <main className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col bg-background"
                >
                  <CardHeader className="pb-3">
                    {resource.thumbnail && (
                      <div className="aspect-video bg-muted/50 rounded-lg mb-3 overflow-hidden">
                        <Image
                          src={resource.thumbnail || "/placeholder.svg"}
                          alt={resource.title}
                          width={300}
                          height={169}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-primary">
                        {getResourceIcon(resource.type)}
                        <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                          {resource.type}
                        </Badge>
                        {resource.duration && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {resource.duration}
                          </div>
                        )}
                      </div>
                      <Badge className={cn("text-xs px-2 py-0.5", getDifficultyColor(resource.difficulty))}>
                        {resource.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-foreground">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags &&
                          resource.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-secondary text-secondary-foreground"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                      <span>By {resource.author}</span>
                      <Badge variant="outline" className="border-primary/30 text-primary/80">
                        {resource.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No resources found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </main>

          {/* Brand Hub */}
          <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 overflow-y-auto bg-background p-4 rounded-lg shadow border border-input">
            <h2 className="text-base font-semibold text-foreground mb-4">The Soil King Hub</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Connect With The Soil King</h3>
                <div className="flex space-x-3">
                  <Link href="https://www.linkedin.com/in/patrick-king-thesoilking/" passHref legacyBehavior>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                  </Link>
                  <Link href="https://x.com/TheSoilKing" passHref legacyBehavior>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Twitter / X"
                    >
                      <Twitter size={20} />
                    </a>
                  </Link>
                  <Link href="https://thesoilking.com/" passHref legacyBehavior>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Website"
                    >
                      <GlobeIcon size={20} />
                    </a>
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Links</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link
                      href="https://thesoilking.com/"
                      className="text-foreground hover:text-primary hover:underline"
                    >
                      The Soil King Website
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://thesoilking.com/big-rootz-soil/"
                      className="text-foreground hover:text-primary hover:underline"
                    >
                      Big Rootz Soil
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://thesoilking.com/blog/"
                      className="text-foreground hover:text-primary hover:underline"
                    >
                      Blog & Articles
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://thesoilking.com/contact-us/"
                      className="text-foreground hover:text-primary hover:underline"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="https://thesoilking.com/shop/" target="_blank" rel="noopener noreferrer">
                  Shop Big Rootz Soil
                </a>
              </Button>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="border-t border-input bg-background px-6 py-4 flex-shrink-0">
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
