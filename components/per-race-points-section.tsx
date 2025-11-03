"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useMemo, useState } from "react"

const RACES_KEY = "f1_races_results"

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

const pointsFor = (pos: number) => {
  const table = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
  return table[pos - 1] || 0
}

export function PerRacePointsSection() {
  const [races, setRaces] = useState<Race[]>([])
  const [selectedRaceId, setSelectedRaceId] = useState<string>("")

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RACES_KEY)
      if (stored) setRaces(JSON.parse(stored))
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

  const selectedRace = useMemo(() => races.find(r => r.id === selectedRaceId), [races, selectedRaceId])
  const raceOptions = races.map(r => ({ id: r.id, label: `${r.name}${r.date ? ` – ${r.date}` : ""}` }))

  const perRaceRows = useMemo(() => {
    if (!selectedRace) return [] as Array<{ key: string; driver: string; team?: string; points: number; pos: number }>
    return (selectedRace.results || [])
      .filter(rr => rr.driver)
      .map(rr => ({ key: `${rr.driver}#${rr.number || ""}`, driver: rr.driver, team: rr.team, points: pointsFor(rr.position), pos: rr.position }))
      .sort((a, b) => a.pos - b.pos)
  }, [selectedRace])

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-foreground">Puntos por carrera</h3>
        <select
          className="border rounded-md px-2 py-1 text-sm bg-background"
          value={selectedRaceId}
          onChange={(e) => setSelectedRaceId(e.target.value)}
        >
          <option value="">Seleccionar carrera…</option>
          {raceOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {!selectedRaceId ? (
        <p className="text-sm text-muted-foreground">Elegí una carrera para ver el detalle de puntos del Top 10.</p>
      ) : perRaceRows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay resultados cargados para esta carrera.</p>
      ) : (
        <div className="space-y-2">
          {perRaceRows.map((entry) => (
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
      )}
    </Card>
  )
}
