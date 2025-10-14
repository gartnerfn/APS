"use client"

import { Card } from "@/components/ui/card"
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useState, useEffect } from "react"

const defaultStandings = [
  { position: 1, driver: "Max Verstappen", team: "Red Bull Racing", points: 575, change: 0, country: "🇳🇱" },
  { position: 2, driver: "Yuki Tsunoda", team: "Red Bull Racing", points: 285, change: 0, country: "🇲🇽" },
  { position: 3, driver: "Lewis Hamilton", team: "Mercedes", points: 234, change: 1, country: "🇬🇧" },
  { position: 4, driver: "Fernando Alonso", team: "Aston Martin", points: 206, change: -1, country: "🇪🇸" },
  { position: 5, driver: "Charles Leclerc", team: "Ferrari", points: 206, change: 0, country: "🇲🇨" },
  { position: 6, driver: "Lando Norris", team: "McLaren", points: 205, change: 2, country: "🇬🇧" },
  { position: 7, driver: "Carlos Sainz", team: "Ferrari", points: 200, change: -1, country: "🇪🇸" },
  { position: 8, driver: "George Russell", team: "Mercedes", points: 175, change: 0, country: "🇬🇧" },
  { position: 9, driver: "Oscar Piastri", team: "McLaren", points: 97, change: 1, country: "🇦🇺" },
  { position: 10, driver: "Lance Stroll", team: "Aston Martin", points: 74, change: -2, country: "🇨🇦" },
]

const defaultTeamStandings = [
  { position: 1, team: "Red Bull Racing", points: 860, change: 0 },
  { position: 2, team: "Mercedes", points: 409, change: 1 },
  { position: 3, team: "Ferrari", points: 406, change: -1 },
  { position: 4, team: "McLaren", points: 302, change: 0 },
  { position: 5, team: "Aston Martin", points: 280, change: 0 },
]

export function StandingsSection() {
  const [standings, setStandings] = useState(defaultStandings)
  const [teamStandings, setTeamStandings] = useState(defaultTeamStandings)

  useEffect(() => {
    // Cargar pilotos y escuderías desde localStorage
    const storedDrivers = localStorage.getItem('f1_drivers_manual')
    const storedTeams = localStorage.getItem('f1_teams_manual')

    if (storedDrivers) {
      const adminDrivers = JSON.parse(storedDrivers)
      const formattedStandings = adminDrivers.map((driver: any, index: number) => ({
        position: index + 1,
        driver: driver.name,
        team: driver.team,
        points: Math.floor(Math.random() * 300), // Puntos aleatorios para demo
        change: 0,
        country: getCountryFlag(driver.nationality)
      }))
      
      setStandings([...formattedStandings, ...defaultStandings])
    }

    if (storedTeams) {
      const adminTeams = JSON.parse(storedTeams)
      const formattedTeamStandings = adminTeams.map((team: any, index: number) => ({
        position: index + 1,
        team: team.name,
        points: Math.floor(Math.random() * 500), // Puntos aleatorios para demo
        change: 0
      }))
      
      setTeamStandings([...formattedTeamStandings, ...defaultTeamStandings])
    }
  }, [])

  const getCountryFlag = (nationality: string) => {
    const flags: { [key: string]: string } = {
      'Dutch': '🇳🇱',
      'Japanese': '🇯🇵', 
      'Monégasque': '🇲🇨',
      'British': '🇬🇧',
      'Spanish': '🇪🇸',
      'Mexican': '🇲🇽',
      'Australian': '🇦🇺',
      'Canadian': '🇨🇦',
      'French': '🇫🇷',
      'Argentinian': '🇦🇷',
      'Thai': '🇹🇭',
      'German': '🇩🇪',
      'Finnish': '🇫🇮',
      'Danish': '🇩🇰'
    }
    return flags[nationality] || '🏁'
  }
  return (
    <section id="puntajes" className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-10 w-10 text-primary" />
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">CLASIFICACIÓN</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Driver Standings */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-2xl font-bold mb-4 text-foreground">Campeonato de Pilotos</h3>
          <div className="space-y-2">
            {standings.map((entry) => (
              <div
                key={entry.position}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div
                  className={`text-2xl font-bold w-8 ${entry.position <= 3 ? "text-primary" : "text-muted-foreground"}`}
                >
                  {entry.position}
                </div>
                <div className="text-xl">{entry.country}</div>
                <div className="flex-1">
                  <div className="font-bold text-foreground">{entry.driver}</div>
                  <div className="text-sm text-muted-foreground">{entry.team}</div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.change > 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {entry.change < 0 && <TrendingDown className="h-4 w-4 text-red-500" />}
                  {entry.change === 0 && <Minus className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="text-2xl font-bold text-foreground w-16 text-right">{entry.points}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Standings */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-2xl font-bold mb-4 text-foreground">Campeonato de Constructores</h3>
          <div className="space-y-2">
            {teamStandings.map((entry) => (
              <div
                key={entry.position}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div
                  className={`text-3xl font-bold w-10 ${entry.position <= 3 ? "text-primary" : "text-muted-foreground"}`}
                >
                  {entry.position}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-foreground">{entry.team}</div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.change > 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {entry.change < 0 && <TrendingDown className="h-4 w-4 text-red-500" />}
                  {entry.change === 0 && <Minus className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="text-3xl font-bold text-foreground w-20 text-right">{entry.points}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
