"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EventModal } from "./event-modal"
import { EventList } from "./event-list"
import { toPng } from 'html-to-image'
import { getAllRaces, initializeDefaultRaces } from "@/lib/default-races"
import { getAllInspections, formatInspectionAsCalendarEvent } from "@/lib/default-inspections"

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "race" | "practice" | "qualifying" | "custom" | "inspection"
  description?: string
  time?: string
  status?: string
  inspector?: string
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  // Cargar eventos desde localStorage
  useEffect(() => {
    const loadEvents = () => {
      let allEvents: CalendarEvent[] = []
      
      // Inicializar carreras por defecto
      initializeDefaultRaces()
      
      // Cargar eventos del calendario (creados en el calendario)
      const stored = localStorage.getItem("f1-calendar-events")
      if (stored) {
        allEvents = JSON.parse(stored)
      }
      
      // Cargar carreras por defecto (estaticas del calendario F1 2025)
      const defaultRaces = getAllRaces()
      const formattedDefaultRaces: CalendarEvent[] = defaultRaces.map((race) => ({
        id: `default-${race.id}`,
        title: race.name,
        date: race.fullDate,
        type: "race" as const,
        description: `${race.circuit} - ${race.country}`,
        time: "TBD"
      }))
      
      // Cargar inspecciones/controles (creadas por admin)
      const inspections = getAllInspections()
      const formattedInspections: CalendarEvent[] = inspections.map(formatInspectionAsCalendarEvent)
      
      allEvents = [...allEvents, ...formattedDefaultRaces, ...formattedInspections]
      
      setEvents(allEvents)
    }
    
    loadEvents()
    
    // Escuchar cambios en los eventos del admin
    const handleStorageChange = () => {
      loadEvents()
    }
    
    window.addEventListener('f1-events-updated', handleStorageChange)
    return () => window.removeEventListener('f1-events-updated', handleStorageChange)
  }, [])

  // Guardar eventos en localStorage (solo eventos del calendario, no del admin ni por defecto)
  useEffect(() => {
    const calendarEvents = events.filter(event => !event.id.startsWith('admin-') && !event.id.startsWith('default-'))
    localStorage.setItem("f1-calendar-events", JSON.stringify(calendarEvents))
  }, [events])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handlePrevYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()))
  }

  const handleNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()))
  }

  const handleAddEvent = (event: CalendarEvent) => {
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === editingEvent.id ? event : e)))
      setEditingEvent(null)
    } else {
      setEvents([...events, event])
    }
    setShowModal(false)
    setSelectedDate(null)
  }

  const handleDeleteEvent = (id: string) => {
    // No permitir eliminar eventos del admin o carreras por defecto
    if (id.startsWith('admin-') || id.startsWith('default-')) {
      alert('Las carreras oficiales de F1 no se pueden eliminar.')
      return
    }
    setEvents(events.filter((e) => e.id !== id))
  }

  const handleEditEvent = (event: CalendarEvent) => {
    // No permitir editar eventos del admin o carreras por defecto
    if (event.id.startsWith('admin-') || event.id.startsWith('default-')) {
      alert('Las carreras oficiales de F1 no se pueden editar.')
      return
    }
    setEditingEvent(event)
    setSelectedDate(event.date)
    setShowModal(true)
  }

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
    setEditingEvent(null)
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.date === dateStr)
  }

  const days = []
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      race: "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400",
      practice: "bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400",
      qualifying: "bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-400",
      custom: "bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-400",
    }
    return colors[type] || colors.custom
  }

  const handleDownloadCalendar = () => {
    const element = document.querySelector('.calendar-grid') as HTMLElement;
    
    toPng(element, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'captura.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Error al capturar:', err));
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Calendario F1</h1>
          <p className="text-muted-foreground text-lg">Gestiona todos tus eventos de Fórmula 1</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Calendario Principal */}
          <Card className="bg-white text-black calendar-grid md:col-span-2 p-6 border-2">
            {/* Navegación */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevYear}
                  className="hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground w-12 text-center">
                  {currentDate.getFullYear()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextYear}
                  className="hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <h2 className="text-2xl font-bold text-foreground">{MONTHS[currentDate.getMonth()]}</h2>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevMonth}
                  className="hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextMonth}
                  className="hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {DAYS.map((day) => (
                <div key={day} className="text-center font-semibold text-primary py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid de días */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : []
                return (
                  <div
                    key={index}
                    onClick={() => day && handleDateClick(day)}
                    className={`min-h-24 p-2 border-2 rounded-lg transition-all ${day
                      ? "cursor-pointer border-border hover:border-primary hover:bg-primary/5 bg-card"
                      : "border-transparent bg-muted/30"
                      }`}
                  >
                    {day && (
                      <>
                        <div className="font-bold text-foreground mb-1">{day}</div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditEvent(event)
                              }}
                              className={`text-xs px-2 py-1 rounded cursor-pointer border truncate hover:opacity-80 transition-opacity ${getEventColor(event.type)}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground px-2">+{dayEvents.length - 2} más</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Panel lateral - Eventos del día seleccionado */}
          <div className="flex flex-col gap-6">
            {/* Agregar evento rápido */}
            <Card className="p-4 border-2 bg-primary/5">
              <Button
                onClick={() => {
                  setEditingEvent(null)
                  setShowModal(true)
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Evento
              </Button>
            </Card>

            <Card className="p-4 border-2 bg-primary/5">
              <Button
                onClick={handleDownloadCalendar}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar calendario
              </Button>
            </Card>

            {/* Lista de eventos */}
            {selectedDate && (
              <Card className="p-4 border-2 flex-1">
                <h3 className="font-bold text-lg mb-4 text-foreground">
                  Eventos del {selectedDate}
                </h3>
                <EventList
                  events={getEventsForDate(Number.parseInt(selectedDate.split("-")[2]))}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  getEventColor={getEventColor}
                />
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de evento */}
      {showModal && (
        <EventModal
          date={selectedDate}
          event={editingEvent}
          onClose={() => {
            setShowModal(false)
            setEditingEvent(null)
          }}
          onSave={handleAddEvent}
        />
      )}
    </div>
  )
}
