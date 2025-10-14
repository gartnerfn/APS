"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Gavel } from "lucide-react"
import { useState, useEffect } from "react"

export function FiaSection() {
  const [fiaData, setFiaData] = useState<any[]>([])

  useEffect(() => {
    // Cargar datos FIA desde localStorage (cargados por el admin)
    const storedFiaData = localStorage.getItem('f1_fia_manual')
    if (storedFiaData) {
      setFiaData(JSON.parse(storedFiaData))
    }
  }, [])

  const formatDate = (dateValue: any) => {
    if (!dateValue) return null
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('es-ES')
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Técnico':
        return <Shield className="h-4 w-4" />
      case 'Deportivo':
        return <Gavel className="h-4 w-4" />
      case 'Penalización':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Técnico':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Deportivo':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Penalización':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Decisión':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (fiaData.length === 0) {
    return null // No mostrar la sección si no hay datos
  }

  return (
    <section id="fia" className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-10 w-10 text-primary" />
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">INFORMACIÓN FIA</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fiaData.map((fia) => (
          <Card key={fia.id} className="bg-card border-border p-5 hover:border-primary transition-colors">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${getCategoryColor(fia.category)}`}
                >
                  {getCategoryIcon(fia.category)}
                  {fia.category}
                </Badge>
                {(formatDate(fia.date) || formatDate(fia.created)) && (
                  <div className="text-xs text-muted-foreground">
                    {formatDate(fia.date) || formatDate(fia.created)}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-foreground mb-2">{fia.title}</h3>
                <p className="text-sm text-muted-foreground">{fia.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}