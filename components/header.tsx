import { Flag } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <Flag className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tighter text-foreground">FÓRMULA 1</h1>
        </div>
        <nav className="mt-6 flex gap-6 text-sm font-medium">
          <a href="#calendario" className="text-foreground hover:text-primary transition-colors">
            CALENDARIO
          </a>
          <a href="#pilotos" className="text-foreground hover:text-primary transition-colors">
            PILOTOS
          </a>
          <a href="#puntajes" className="text-foreground hover:text-primary transition-colors">
            PUNTAJES
          </a>
          <a href="#sanciones" className="text-foreground hover:text-primary transition-colors">
            SANCIONES
          </a>
        </nav>
      </div>
    </header>
  )
}
