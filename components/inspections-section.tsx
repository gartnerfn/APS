"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, GaugeCircle, ClipboardCheck, AlertTriangle, Ban } from "lucide-react"

type InspectionStatus = "programado" | "en_progreso" | "completado" | "observacion" | "sancion"
type InspectionType = "neumaticos" | "tecnica"

interface Inspection {
  id: string
  type: InspectionType
  eventName?: string
  teamName: string
  scheduledAt?: string
  performedAt?: string
  inspector?: string
  status: InspectionStatus
  resultsSummary?: string
  createdAt?: string
}

export function InspectionsSection() {
  const [inspections, setInspections] = useState<Inspection[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("f1_fia_inspections")
      if (stored) {
        const parsed: Inspection[] = JSON.parse(stored)
        // Orden: recientes primero
        parsed.sort((a, b) => (b.createdAt ?? "") > (a.createdAt ?? "") ? 1 : -1)
        setInspections(parsed)
      }
    } catch {}
  }, [])

  if (!inspections || inspections.length === 0) return null

  const statusPill = (status: InspectionStatus) => {
    const base = "text-xs px-2 py-0.5 rounded-md border"
    switch (status) {
      case "programado":
        return `${base} bg-blue-100 text-blue-800 border-blue-200`
      case "en_progreso":
        return `${base} bg-yellow-100 text-yellow-800 border-yellow-200`
      case "completado":
        return `${base} bg-green-100 text-green-800 border-green-200`
      case "observacion":
        return `${base} bg-orange-100 text-orange-800 border-orange-200`
      case "sancion":
        return `${base} bg-red-100 text-red-800 border-red-200`
      default:
        return `${base} bg-gray-100 text-gray-800 border-gray-200`
    }
  }

  const typeBadge = (type: InspectionType) => (
    <Badge variant="outline" className="gap-1">
      {type === "neumaticos" ? <GaugeCircle className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
      {type === "neumaticos" ? "Neumáticos" : "Técnica"}
    </Badge>
  )

  const statusIcon = (status: InspectionStatus) => {
    switch (status) {
      case "completado":
        return <ClipboardCheck className="h-4 w-4 text-green-600" />
      case "observacion":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "sancion":
        return <Ban className="h-4 w-4 text-red-600" />
      default:
        return <Wrench className="h-4 w-4 text-muted-foreground" />
    }
  }

  const fmt = (iso?: string) => {
    if (!iso) return null
    const d = new Date(iso)
    return isNaN(d.getTime()) ? null : d.toLocaleString("es-ES")
  }

  return (
    <section id="controles" className="space-y-6">
      <div className="flex items-center gap-3">
        <Wrench className="h-10 w-10 text-primary" />
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">CONTROLES</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inspections.map((i) => (
          <Card key={i.id} className="bg-card border-border p-5 hover:border-primary transition-colors">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                {typeBadge(i.type)}
                <div className={statusPill(i.status)}>{i.status.replace("_", " ")}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Escudería</div>
                  <div className="font-bold text-foreground">{i.teamName}</div>
                </div>
                {statusIcon(i.status)}
              </div>
              {i.eventName && (
                <div>
                  <div className="text-sm text-muted-foreground">Evento</div>
                  <div className="text-sm font-medium text-foreground">{i.eventName}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                {fmt(i.scheduledAt) && <div>Programado: {fmt(i.scheduledAt)}</div>}
                {fmt(i.performedAt) && <div>Realizado: {fmt(i.performedAt)}</div>}
              </div>
              {i.resultsSummary && (
                <div className="pt-2 border-t border-border text-sm text-foreground whitespace-pre-wrap">
                  {i.resultsSummary}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
