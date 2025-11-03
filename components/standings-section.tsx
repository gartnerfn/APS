  type DriverRaceRow = DriverRow & { pos: number }
"use client"

import { Card } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

type RaceDriverResult = {
  position: number
  driver: string
  number?: string
  team?: string
}

type Race = {
  id: string
  name: string
  date?: string
  results: RaceDriverResult[]
}

type DriverRow = {
  key: string
  driver: string
  number?: string
  team?: string
  points: number
}

const RACES_KEY = "f1_races_results"

const pointsFor = (pos: number) => {
  const table = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
  return table[pos - 1] || 0
}

export function StandingsSection() {
  const [races, setRaces] = useState<Race[]>([])
  const [selectedRaceId, setSelectedRaceId] = useState<string>("")

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RACES_KEY)
      if (!stored) return
      const parsed: Race[] = JSON.parse(stored)
      setRaces(parsed)
    } catch {}

    const onUpdate = () => {
      try {
        const s = localStorage.getItem(RACES_KEY)
        if (!s) return
        setRaces(JSON.parse(s))
      } catch {}
    }
    window.addEventListener("f1-races-updated", onUpdate)
    return () => window.removeEventListener("f1-races-updated", onUpdate)
  }, [])

  // Campeonato de pilotos (acumulado)
  const driverChampionship = useMemo<DriverRow[]>(() => {
    const map = new Map<string, DriverRow>()
    for (const race of races) {
      for (const rr of race.results || []) {
        if (!rr?.driver) continue
        const key = `${rr.driver}#${rr.number || ""}`
        const pts = pointsFor(rr.position)
        const prev = map.get(key)
        if (prev) {
          prev.points += pts
          // mantener último team si viene
          if (rr.team) prev.team = rr.team
        } else {
          map.set(key, {
            key,
            driver: rr.driver,
            number: rr.number,
            team: rr.team,
            points: pts,
          })
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.points - a.points).map((row, idx) => ({ ...row, key: row.key || String(idx) }))
  }, [races])

  // Campeonato de constructores (acumulado)
  const constructorChampionship = useMemo(() => {
    const map = new Map<string, number>()
    for (const race of races) {
      for (const rr of race.results || []) {
        if (!rr?.driver || !rr?.team) continue
        const pts = pointsFor(rr.position)
        map.set(rr.team, (map.get(rr.team) || 0) + pts)
      }
    }
    const list = Array.from(map.entries()).map(([team, points]) => ({ team, points }))
    return list.sort((a, b) => b.points - a.points)
  }, [races])

  // Opciones de carreras y puntos por carrera para la vista de pilotos
  const raceOptions = races.map(r => ({ id: r.id, label: `${r.name}${r.date ? ` – ${r.date}` : ""}` }))
  const selectedRace = useMemo(() => races.find(r => r.id === selectedRaceId), [races, selectedRaceId])
  const perRacePoints = useMemo(() => {
    if (!selectedRace) return [] as DriverRaceRow[]
    const rows: DriverRaceRow[] = (selectedRace.results || [])
      .filter(rr => rr.driver)
      .map(rr => ({
        key: `${rr.driver}#${rr.number || ""}`,
        driver: rr.driver,
        number: rr.number,
        team: rr.team,
        points: pointsFor(rr.position),
        pos: rr.position,
      }))
    return rows.sort((a, b) => a.pos - b.pos)
  }, [selectedRace])

  // La selección de carrera y los puntos por carrera se movieron a una sección de usuario (p. ej., perfil)

  return (
    <section id="puntajes" className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-10 w-10 text-primary" />
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">CLASIFICACIÓN</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Campeonato de Pilotos (Acumulado o por carrera) */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-foreground">Campeonato de Pilotos</h3>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Vista:</label>
              <select
                className="border rounded-md px-2 py-1 text-sm bg-background"
                value={selectedRaceId}
                onChange={(e) => setSelectedRaceId(e.target.value)}
              >
                <option value="">Acumulado</option>
                {raceOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vista acumulada si no hay carrera seleccionada */}
          {(!selectedRaceId) ? (
            driverChampionship.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin datos. Cargá resultados en el panel de administración.</p>
            ) : (
              <div className="space-y-2">
                {driverChampionship.map((entry, idx) => (
                  <div key={entry.key} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className={`text-2xl font-bold w-8 ${idx < 3 ? "text-primary" : "text-muted-foreground"}`}>{idx + 1}</div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{entry.driver}</div>
                      <div className="text-sm text-muted-foreground">{entry.team || ""}</div>
                    </div>
                    <div className="text-2xl font-bold text-foreground w-16 text-right">{entry.points}</div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Vista por carrera
            perRacePoints.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay resultados cargados para la carrera seleccionada.</p>
            ) : (
              <div className="space-y-2">
                {perRacePoints.map((entry) => (
                  <div key={entry.key} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className={`text-2xl font-bold w-8 ${entry.pos <= 3 ? "text-primary" : "text-muted-foreground"}`}>{entry.pos}</div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{entry.driver}</div>
                      <div className="text-sm text-muted-foreground">{entry.team || ""}</div>
                    </div>
                    <div className="text-2xl font-bold text-foreground w-16 text-right">{entry.points}</div>
                  </div>
                ))}
              </div>
            )
          )}
        </Card>

        {/* Campeonato de Constructores */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-2xl font-bold mb-4 text-foreground">Campeonato de Constructores</h3>
          {constructorChampionship.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin datos. Cargá resultados para ver puntos por escudería.</p>
          ) : (
            <div className="space-y-2">
              {constructorChampionship.map((entry, idx) => (
                <div key={entry.team} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className={`text-2xl font-bold w-8 ${idx < 3 ? "text-primary" : "text-muted-foreground"}`}>{idx + 1}</div>
                  <div className="flex-1">
                    <div className="font-bold text-foreground">{entry.team}</div>
                  </div>
                  <div className="text-2xl font-bold text-foreground w-16 text-right">{entry.points}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
