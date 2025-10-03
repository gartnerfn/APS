import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const drivers = [
  {
    name: "Max Verstappen",
    number: "1",
    team: "Red Bull Racing",
    country: "🇳🇱",
    image: "/f1-driver-portrait-racing-suit-red-bull.jpg",
    points: 575,
  },
  {
    name: "Sergio Pérez",
    number: "11",
    team: "Red Bull Racing",
    country: "🇲🇽",
    image: "/f1-driver-portrait-racing-suit-red-bull-mexican.jpg",
    points: 285,
  },
  {
    name: "Lewis Hamilton",
    number: "44",
    team: "Mercedes",
    country: "🇬🇧",
    image: "/f1-driver-portrait-racing-suit-mercedes.jpg",
    points: 234,
  },
  {
    name: "Fernando Alonso",
    number: "14",
    team: "Aston Martin",
    country: "🇪🇸",
    image: "/f1-driver-portrait-racing-suit-aston-martin.jpg",
    points: 206,
  },
  {
    name: "Charles Leclerc",
    number: "16",
    team: "Ferrari",
    country: "🇲🇨",
    image: "/f1-driver-portrait-racing-suit-ferrari.jpg",
    points: 206,
  },
  {
    name: "Lando Norris",
    number: "4",
    team: "McLaren",
    country: "🇬🇧",
    image: "/f1-driver-portrait-racing-suit-mclaren.jpg",
    points: 205,
  },
]

export function DriversSection() {
  return (
    <section id="pilotos" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">PILOTOS 2025</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {drivers.map((driver, index) => (
          <Card
            key={index}
            className="overflow-hidden bg-card border-border group hover:border-primary transition-all hover:scale-105"
          >
            <div className="relative h-64 overflow-hidden bg-secondary">
              <img src={driver.image || "/placeholder.svg"} alt={driver.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="text-xs font-bold bg-secondary/90 backdrop-blur-sm">
                  {driver.team}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 text-2xl">{driver.country}</div>
            </div>
            <div className="p-4 space-y-2">
              <div className="text-4xl font-bold text-muted-foreground">#{driver.number}</div>
              <h3 className="text-lg font-bold tracking-tight text-foreground leading-tight">{driver.name}</h3>
              <div className="text-sm text-muted-foreground">{driver.points} puntos</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
