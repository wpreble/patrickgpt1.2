// Placeholder for ChatHeader component
import { ModelSelector } from "@/components/model-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, User } from "lucide-react"

export default function ChatHeader() {
  return (
    <div className="flex justify-between items-center p-3 md:p-4 border-b border-input flex-shrink-0">
      <div className="flex items-center min-w-0">
        <ModelSelector />
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 h-8 w-8 md:h-9 md:w-9">
          <Settings size={16} className="md:w-[18px] md:h-[18px]" />
        </Button>
        <Avatar className="h-7 w-7 md:h-8 md:w-8 bg-gray-200 dark:bg-gray-700">
          <AvatarFallback className="text-gray-600 dark:text-gray-300">
            <User size={14} className="md:w-4 md:h-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
