"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const models = [
  {
    id: "probioticgardener-01",
    name: "Probiotic Gardener",
    description: "Expert advice for soil health & gardening",
  },
  // {
  //   id: "soilking-experimental-01",
  //   name: "SoilKing Experimental",
  //   description: "Next-gen soil analysis (beta)",
  // },
]

interface ModelSelectorProps {
  className?: string
}

export function ModelSelector({ className }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = React.useState(models[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1.5 text-base font-medium focus:outline-none focus:ring-0 text-foreground", // Updated text color
            className,
          )}
        >
          {selectedModel.name}
          <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" /> {/* Updated text color */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[250px]">
        {" "}
        {/* Increased width for longer description */}
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            className="flex items-center justify-between py-2"
            onSelect={() => setSelectedModel(model)}
            disabled={model.id !== "probioticgardener-01"} // Only enable the main model for now
          >
            <div>
              <p className="text-sm font-medium">{model.name}</p>
              <p className="text-xs text-muted-foreground">{model.description}</p>
            </div>
            {selectedModel.id === model.id && <Check className="h-4 w-4 text-primary" />}{" "}
            {/* Use primary color for check */}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
