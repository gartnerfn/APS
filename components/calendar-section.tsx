"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getAllRaces, initializeDefaultRaces, type F1Race } from "@/lib/default-races"

export function CalendarSection() {
  const [events, setEvents] = useState<F1Race[]>([])

  useEffect(() => {
    // Inicializar carreras por defecto
    initializeDefaultRaces()
    
    // Cargar todas las carreras (por defecto + del admin)
    const loadRaces = () => {
      const allRaces = getAllRaces()
      setEvents(allRaces)
    }
    
    loadRaces()
    
    // Escuchar cambios en las carreras del admin
    const handleRacesUpdate = () => {
      loadRaces()
    }
    
    window.addEventListener('f1-events-updated', handleRacesUpdate)
    return () => window.removeEventListener('f1-events-updated', handleRacesUpdate)
  }, [])
  return (
    <section id="calendario" className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-left sm:items-center justify-between">
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">CALENDARIO 2025</h2>
        <Link href="/calendar">
        
        <Button variant="outline" className="gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          Ver Calendario Completo
        </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, 6).map((race, index) => (
          <Card
            key={index}
            className="overflow-hidden bg-card border-border group hover:border-primary transition-colors"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={race.image || "/placeholder.svg"}
                alt={race.country}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-secondary/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-secondary-foreground">
                {race.status}
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="text-sm font-bold text-muted-foreground">{race.date}</div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">{race.country}</h3>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{race.circuit}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Ver Detalles
                </Button>
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Resultados
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
