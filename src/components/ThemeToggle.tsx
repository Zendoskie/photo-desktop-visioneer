
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { Toggle } from "@/components/ui/toggle"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-9 px-0"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-appGreen/90" />
      ) : (
        <Moon className="h-4 w-4 text-appGreen/90" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
