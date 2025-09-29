import { Moon, Sun, Monitor } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const getIcon = () => {
    switch (theme) {
      case "light":
        return Sun
      case "dark":
        return Moon
      default:
        return Monitor
    }
  }

  const Icon = getIcon()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          Light
          {theme === "light" && (
            <motion.div
              layoutId="theme-indicator"
              className="w-1 h-1 bg-primary rounded-full ml-auto"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          Dark
          {theme === "dark" && (
            <motion.div
              layoutId="theme-indicator"
              className="w-1 h-1 bg-primary rounded-full ml-auto"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2"
        >
          <Monitor className="h-4 w-4" />
          System
          {theme === "system" && (
            <motion.div
              layoutId="theme-indicator"
              className="w-1 h-1 bg-primary rounded-full ml-auto"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}