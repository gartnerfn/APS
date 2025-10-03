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
    image: "/max-verstappen.png",
    points: 0,  // inicial listo para actualizar
  },
  {
    name: "Yuki Tsunoda",
    number: "22",
    team: "Racing Bulls",
    country: "🇯🇵",
    image: "/yuki-tsunoda.png",
    points: 0,
  },
  {
    name: "Charles Leclerc",
    number: "16",
    team: "Ferrari",
    country: "🇲🇨",
    image: "/charles-leclerc.png",
    points: 0,
  },
  {
    name: "Lewis Hamilton",
    number: "44",
    team: "Ferrari",
    country: "🇬🇧",
    image: "/lewis-hamilton.png",
    points: 0,
  },
  {
    name: "George Russell",
    number: "63",
    team: "Mercedes",
    country: "🇬🇧",
    image: "/george-russell.png",
    points: 0,
  },
  {
    name: "Andrea Kimi Antonelli",
    number: "12",
    team: "Mercedes",
    country: "🇮🇹",
    image: "/kimi-antonelli.png",
    points: 0,
  },
  {
    name: "Oscar Piastri",
    number: "81",
    team: "McLaren",
    country: "🇦🇺",
    image: "/oscar-piastri.png",
    points: 0,
  },
  {
    name: "Lando Norris",
    number: "4",
    team: "McLaren",
    country: "🇬🇧",
    image: "/lando-norris.png",
    points: 0,
  },
  {
    name: "Fernando Alonso",
    number: "14",
    team: "Aston Martin",
    country: "🇪🇸",
    image: "/fernando-alonso.png",
    points: 0,
  },
  {
    name: "Lance Stroll",
    number: "18",
    team: "Aston Martin",
    country: "🇨🇦",
    image: "/lance-stroll.png",
    points: 0,
  },
  {
    name: "Pierre Gasly",
    number: "10",
    team: "Alpine",
    country: "🇫🇷",
    image: "/pierre-gasly.png",
    points: 0,
  },
  {
    name: "Franco Colapinto",
    number: "43",
    team: "Alpine",
    country: "🇦🇷",
    image: "/franco-colapinto.png",
    points: 0,
  },
  {
    name: "Alex Albon",
    number: "23",
    team: "Williams",
    country: "🇹🇭", // doble nacionalidad posible
    image: "/alexander-albon.png",
    points: 0,
  },
  {
    name: "Carlos Sainz",
    number: "55",
    team: "Williams",
    country: "🇪🇸",
    image: "/carlos-sainz.png",
    points: 0,
  },
  {
    name: "Nico Hülkenberg",
    number: "27",
    team: "Sauber",
    country: "🇩🇪",
    image: "/nico-hulkenberg.png",
    points: 0,
  },
  {
    name: "Gabriel Bortoleto",
    number: "5",
    team: "Sauber",
    country: "🇧🇷",
    image: "/gabriel-bortoleto.png",
    points: 0,
  },
  {
    name: "Oliver Bearman",
    number: "87",
    team: "Haas",
    country: "🇬🇧",
    image: "/oliver-bearman.png",
    points: 0,
  },
  {
    name: "Esteban Ocon",
    number: "31",
    team: "Haas",
    country: "🇫🇷",
    image: "/esteban-ocon.png",
    points: 0,
  }
];

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
