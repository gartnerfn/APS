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
        try {
          const parsedEvents = JSON.parse(stored)
          console.log('Cargando eventos del localStorage:', parsedEvents)
          allEvents = parsedEvents
        } catch (error) {
          console.error('Error al cargar eventos del localStorage:', error)
          allEvents = []
        }
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
    
    // Escuchar cambios en los eventos del admin y las inspecciones
    const handleStorageChange = () => {
      // Al recargar eventos, preservar los eventos del calendario actual
      const currentCalendarEvents = events.filter(event => event.id.startsWith('event-'))
      
      // Cargar otros eventos
      let allEvents: CalendarEvent[] = [...currentCalendarEvents]
      
      const defaultRaces = getAllRaces()
      const formattedDefaultRaces: CalendarEvent[] = defaultRaces.map((race) => ({
        id: `default-${race.id}`,
        title: race.name,
        date: race.fullDate,
        type: "race" as const,
        description: `${race.circuit} - ${race.country}`,
        time: "TBD"
      }))
      
      const inspections = getAllInspections()
      const formattedInspections: CalendarEvent[] = inspections.map(formatInspectionAsCalendarEvent)
      
      allEvents = [...allEvents, ...formattedDefaultRaces, ...formattedInspections]
      setEvents(allEvents)
    }
    
    window.addEventListener('f1-events-updated', handleStorageChange)
    window.addEventListener('f1-inspections-updated', handleStorageChange)
    
    return () => {
      window.removeEventListener('f1-events-updated', handleStorageChange)
      window.removeEventListener('f1-inspections-updated', handleStorageChange)
    }
  }, [])

  // Función para guardar solo los eventos del calendario
  const saveCalendarEvents = (allEvents: CalendarEvent[]) => {
    const calendarEvents = allEvents.filter(event => 
      event.id.startsWith('event-') // Solo eventos creados manualmente en el calendario
    )
    
    console.log('Guardando eventos del calendario:', calendarEvents)
    localStorage.setItem("f1-calendar-events", JSON.stringify(calendarEvents))
  }

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
    console.log('Agregando/editando evento:', event)
    
    let updatedEvents: CalendarEvent[]
    
    if (editingEvent) {
      // Editando evento existente
      updatedEvents = events.map((e) => (e.id === editingEvent.id ? event : e))
      setEditingEvent(null)
    } else {
      // Agregando nuevo evento
      updatedEvents = [...events, event]
    }
    
    setEvents(updatedEvents)
    saveCalendarEvents(updatedEvents) // Guardar explícitamente
    setShowModal(false)
    setSelectedDate(null)
    
    console.log('Eventos actualizados y guardados')
  }

  const handleDeleteEvent = (id: string) => {
    // No permitir eliminar eventos del admin, carreras por defecto o inspecciones
    if (id.startsWith('admin-') || id.startsWith('default-') || id.startsWith('inspection-')) {
      alert('Las carreras oficiales de F1 y los controles FIA no se pueden eliminar desde el calendario.')
      return
    }
    
    const updatedEvents = events.filter((e) => e.id !== id)
    setEvents(updatedEvents)
    saveCalendarEvents(updatedEvents) // Guardar explícitamente
    console.log('Evento eliminado y guardado')
  }

  const handleEditEvent = (event: CalendarEvent) => {
    // No permitir editar eventos del admin, carreras por defecto o inspecciones
    if (event.id.startsWith('admin-') || event.id.startsWith('default-') || event.id.startsWith('inspection-')) {
      alert('Las carreras oficiales de F1 y los controles FIA no se pueden editar desde el calendario.')
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
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      alert('Error: No se pudo crear el canvas')
      return
    }
    
    // Organizar eventos por mes y ordenar por fecha
    const eventsByMonth: { [key: number]: CalendarEvent[] } = {}
    
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      eventsByMonth[monthIndex] = []
    }
    
    events.forEach(event => {
      const eventDate = new Date(event.date)
      const monthIndex = eventDate.getMonth()
      if (eventDate.getFullYear() === 2025) {
        eventsByMonth[monthIndex].push(event)
      }
    })
    
    // Ordenar eventos por fecha y hora
    Object.keys(eventsByMonth).forEach(monthKey => {
      const monthIndex = parseInt(monthKey)
      eventsByMonth[monthIndex].sort((a, b) => {
        const dateA = new Date(a.date + ' ' + (a.time || '00:00'))
        const dateB = new Date(b.date + ' ' + (b.time || '00:00'))
        return dateA.getTime() - dateB.getTime()
      })
    })
    
    // Calcular altura necesaria del canvas basado en contenido
    let totalEvents = 0
    Object.values(eventsByMonth).forEach(monthEvents => {
      totalEvents += monthEvents.length
    })
    
    const baseHeight = 200 // Título y márgenes
    const monthHeaderHeight = 60
    const eventLineHeight = 35
    const monthSeparatorHeight = 40
    const calculatedHeight = Math.max(1600, baseHeight + (12 * monthHeaderHeight) + (totalEvents * eventLineHeight) + (12 * monthSeparatorHeight))
    
    // Configuración del canvas
    canvas.width = 1200
    canvas.height = calculatedHeight
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Configurar fuentes
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    
    // Título principal
    ctx.fillStyle = '#e10e49'
    ctx.font = 'bold 48px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Agenda F1 2025', canvas.width / 2, 40)
    
    // Subtítulo
    ctx.fillStyle = '#666666'
    ctx.font = '18px Arial, sans-serif'
    ctx.fillText('Eventos ordenados cronológicamente', canvas.width / 2, 100)
    
    // Configuración para el texto
    ctx.textAlign = 'left'
    let currentY = 160
    const leftMargin = 60
    const rightMargin = 60
    const contentWidth = canvas.width - leftMargin - rightMargin
    
    // Función para obtener el ícono del tipo de evento
    const getEventIcon = (event: CalendarEvent) => {
      switch (event.type) {
        case 'race': return '🏁'
        case 'inspection': return '🔧'
        case 'practice': return '🏋️'
        case 'qualifying': return '⏱️'
        default: return '📅'
      }
    }
    
    // Función para obtener el color del tipo de evento
    const getEventColor = (event: CalendarEvent) => {
      switch (event.type) {
        case 'race': return '#e10e49'
        case 'inspection': return '#f59e0b'
        case 'practice': return '#8b5cf6'
        case 'qualifying': return '#06b6d4'
        default: return '#3b82f6'
      }
    }
    
    // Dibujar cada mes
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthEvents = eventsByMonth[monthIndex]
      
      // Título del mes
      ctx.fillStyle = '#e10e49'
      ctx.font = 'bold 32px Arial, sans-serif'
      ctx.fillText(MONTHS[monthIndex].toUpperCase(), leftMargin, currentY)
      
      // Línea decorativa debajo del mes
      ctx.strokeStyle = '#e10e49'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(leftMargin, currentY + 40)
      ctx.lineTo(leftMargin + 300, currentY + 40)
      ctx.stroke()
      
      currentY += 70
      
      if (monthEvents.length === 0) {
        // Si no hay eventos en el mes
        ctx.fillStyle = '#999999'
        ctx.font = 'italic 16px Arial, sans-serif'
        ctx.fillText('No hay eventos programados', leftMargin + 20, currentY)
        currentY += 30
      } else {
        // Dibujar eventos del mes
        monthEvents.forEach((event, eventIndex) => {
          const eventDate = new Date(event.date)
          const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][eventDate.getDay()]
          
          // Ícono del tipo de evento
          ctx.font = '20px Arial, sans-serif'
          ctx.fillText(getEventIcon(event), leftMargin + 20, currentY + 5)
          
          // Fecha y día
          ctx.fillStyle = '#333333'
          ctx.font = 'bold 16px Arial, sans-serif'
          const dateText = `${dayName} ${eventDate.getDate().toString().padStart(2, '0')}`
          ctx.fillText(dateText, leftMargin + 55, currentY)
          
          // Hora si existe
          if (event.time) {
            ctx.fillStyle = '#666666'
            ctx.font = '14px Arial, sans-serif'
            ctx.fillText(`${event.time}`, leftMargin + 55, currentY + 18)
          }
          
          // Nombre del evento
          ctx.fillStyle = getEventColor(event)
          ctx.font = 'bold 18px Arial, sans-serif'
          const eventNameX = leftMargin + 200
          ctx.fillText(event.title, eventNameX, currentY)
          
          // Descripción si existe
          if (event.description) {
            ctx.fillStyle = '#666666'
            ctx.font = '14px Arial, sans-serif'
            
            // Dividir descripción si es muy larga
            const maxWidth = contentWidth - 200
            const words = event.description.split(' ')
            let line = ''
            let lineY = currentY + 18
            
            words.forEach(word => {
              const testLine = line + word + ' '
              const metrics = ctx.measureText(testLine)
              
              if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), eventNameX, lineY)
                line = word + ' '
                lineY += 16
              } else {
                line = testLine
              }
            })
            
            if (line.trim() !== '') {
              ctx.fillText(line.trim(), eventNameX, lineY)
            }
          }
          
          // Información adicional para inspecciones
          if (event.type === 'inspection' && event.status) {
            ctx.fillStyle = '#999999'
            ctx.font = '12px Arial, sans-serif'
            ctx.fillText(`Estado: ${event.status}`, eventNameX, currentY + 35)
            
            if (event.inspector) {
              ctx.fillText(`Inspector: ${event.inspector}`, eventNameX + 150, currentY + 35)
            }
          }
          
          currentY += eventLineHeight + 5
        })
      }
      
      currentY += monthSeparatorHeight
    }
    
    // Pie de página con información
    currentY += 20
    ctx.fillStyle = '#999999'
    ctx.font = '12px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`Generado el ${new Date().toLocaleDateString('es-ES')} - Temporada F1 2025`, canvas.width / 2, currentY)
    ctx.fillText('🏁 Carreras F1  🔧 Controles FIA  📅 Eventos Personalizados', canvas.width / 2, currentY + 20)
    
    // Convertir canvas a imagen y descargar
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'agenda-f1-2025.png'
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
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
