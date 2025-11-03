"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { CalendarEvent } from "./calendar"

interface EventModalProps {
  date: string | null
  event?: CalendarEvent | null
  onClose: () => void
  onSave: (event: CalendarEvent) => void
}

export function EventModal({ date, event, onClose, onSave }: EventModalProps) {
  const [title, setTitle] = useState("")
  const [eventDate, setEventDate] = useState(date || "")
  const [type, setType] = useState<"race" | "practice" | "qualifying" | "custom">("custom")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setEventDate(event.date)
      setType(event.type)
      setTime(event.time || "")
      setDescription(event.description || "")
    } else {
      setTitle("")
      setEventDate(date || "")
      setType("custom")
      setTime("")
      setDescription("")
    }
  }, [event, date])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !eventDate) {
      alert("Por favor completa el título y la fecha")
      return
    }

    const newEvent: CalendarEvent = {
      id: event?.id || `event-${Date.now()}`,
      title: title.trim(),
      date: eventDate,
      type,
      time: time || undefined,
      description: description || undefined,
    }

    onSave(newEvent)
  }

  const getTypeLabel = (t: string) => {
    const labels: Record<string, string> = {
      race: "🏁 Carrera",
      practice: "🔧 Práctica",
      qualifying: "⚡ Calificación",
      custom: "📌 Personalizado",
    }
    return labels[t] || t
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 border-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{event ? "Editar Evento" : "Nuevo Evento"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Título *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: GP de Mónaco"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Fecha *</label>
            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Hora</label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Tipo de Evento</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border-2 border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
            >
              <option value="race">{getTypeLabel("race")}</option>
              <option value="practice">{getTypeLabel("practice")}</option>
              <option value="qualifying">{getTypeLabel("qualifying")}</option>
              <option value="custom">{getTypeLabel("custom")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notas adicionales..."
              rows={3}
              className="w-full px-3 py-2 border-2 border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {event ? "Actualizar" : "Crear"} Evento
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
