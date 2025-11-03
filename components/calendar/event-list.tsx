"use client"

import { Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CalendarEvent } from "./calendar"

interface EventListProps {
  events: CalendarEvent[]
  onEdit: (event: CalendarEvent) => void
  onDelete: (id: string) => void
  getEventColor: (type: string) => string
}

export function EventList({ events, onEdit, onDelete, getEventColor }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No hay eventos para esta fecha</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className={`p-3 rounded-lg border-2 space-y-2 ${getEventColor(event.type)}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold">{event.title}</h4>
              {event.time && <p className="text-xs opacity-75">🕐 {event.time}</p>}
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => onEdit(event)} className="p-1 h-auto">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(event.id)}
                className="p-1 h-auto text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {event.description && <p className="text-xs opacity-75">{event.description}</p>}
        </div>
      ))}
    </div>
  )
}
