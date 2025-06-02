// Placeholder for ChatHeader component
import { ModelSelector } from "@/components/model-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, User } from "lucide-react"

export default function ChatHeader() {
  return (
    <div className="flex justify-between items-center p-4 border-b border-input">
      <ModelSelector />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
          <Settings size={18} />
        </Button>
        <Avatar className="h-8 w-8 bg-gray-200 dark:bg-gray-700">
          <AvatarFallback className="text-gray-600 dark:text-gray-300">
            <User size={16} />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
