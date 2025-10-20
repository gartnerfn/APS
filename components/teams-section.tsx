"use client"

import { Card } from "@/components/ui/card"
import { Users, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { getAllTeams, initializeDefaultTeams, type F1Team } from "@/lib/default-teams"

export function TeamsSection() {
  const [teams, setTeams] = useState<F1Team[]>([])

  useEffect(() => {
    // Inicializar escuderías por defecto
    initializeDefaultTeams()
    
    // Obtener todas las escuderías (por defecto + manuales)
    const allTeams = getAllTeams()
    setTeams(allTeams)
  }, [])

  const formatDate = (dateValue: any) => {
    if (!dateValue) return null
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('es-ES')
  }

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Italy': '🇮🇹',
      'Germany': '🇩🇪', 
      'Austria': '🇦🇹',
      'United Kingdom': '🇬🇧',
      'France': '🇫🇷',
      'Switzerland': '🇨🇭',
      'Netherlands': '🇳🇱',
      'Spain': '🇪🇸',
      'Monaco': '🇲🇨',
      'USA': '🇺🇸'
    }
    return flags[country] || '🏁'
  }

  if (teams.length === 0) {
    return null // No mostrar la sección si no hay datos
  }

  return (
    <section id="escuderias" className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-10 w-10 text-primary" />
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">NUEVAS ESCUDERÍAS</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="bg-card border-border hover:border-primary transition-colors overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{getCountryFlag(team.country)}</div>
                    <h3 className="text-xl font-bold text-foreground">{team.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{team.country}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Director: </span>
                    <span className="text-muted-foreground">{team.principal}</span>
                  </div>
                  
                  {formatDate(team.date) && (
                    <div className="text-xs text-blue-600">
                      Fundada: {formatDate(team.date)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}