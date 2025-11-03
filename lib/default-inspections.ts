// Tipos para las inspecciones
export type InspectionStatus = "programado" | "en_progreso" | "completado" | "observacion" | "sancion"
export type InspectionType = "neumaticos" | "tecnica"

export interface Inspection {
  id: string
  type: InspectionType
  eventId?: string
  eventName?: string
  teamId: string
  teamName: string
  teamUserId: string
  scheduledAt: string // formato datetime-local
  inspector: string
  status: InspectionStatus
  parameters?: Record<string, any>
  results?: string
  createdAt: string
  updatedAt: string
}

const INSPECTIONS_KEY = "f1_fia_inspections"

// Función para obtener todas las inspecciones
export function getAllInspections(): Inspection[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(INSPECTIONS_KEY)
    if (stored) {
      const parsed: Inspection[] = JSON.parse(stored)
      return parsed.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    }
  } catch (error) {
    console.error('Error loading inspections:', error)
  }
  
  return []
}

// Función para obtener inspecciones activas (programadas y en progreso)
export function getActiveInspections(): Inspection[] {
  return getAllInspections().filter(i => 
    i.status === "programado" || i.status === "en_progreso"
  )
}

// Función para obtener inspecciones por fecha (para el calendario)
export function getInspectionsByDate(date: string): Inspection[] {
  const inspections = getAllInspections()
  return inspections.filter(inspection => {
    if (!inspection.scheduledAt) return false
    
    // Extraer solo la fecha (YYYY-MM-DD) de la fecha/hora programada
    const inspectionDate = inspection.scheduledAt.split('T')[0]
    return inspectionDate === date
  })
}

// Función para obtener el color del estado de la inspección
export function getInspectionStatusColor(status: InspectionStatus): string {
  switch (status) {
    case "programado":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "en_progreso":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "completado":
      return "bg-green-100 text-green-800 border-green-200"
    case "observacion":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "sancion":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

// Función para obtener el ícono del tipo de inspección
export function getInspectionTypeIcon(type: InspectionType): string {
  switch (type) {
    case "neumaticos":
      return "🏎️"
    case "tecnica":
      return "🔧"
    default:
      return "🔍"
  }
}

// Función para formatear la inspección como evento de calendario
export function formatInspectionAsCalendarEvent(inspection: Inspection) {
  return {
    id: `inspection-${inspection.id}`,
    title: `${getInspectionTypeIcon(inspection.type)} ${inspection.type === 'neumaticos' ? 'Control Neumáticos' : 'Inspección Técnica'}`,
    date: inspection.scheduledAt.split('T')[0], // Solo la fecha
    time: inspection.scheduledAt.split('T')[1]?.substring(0, 5), // Solo la hora HH:MM
    type: "inspection" as const,
    description: `${inspection.teamName} - ${inspection.eventName || 'Control General'}`,
    status: inspection.status,
    inspector: inspection.inspector
  }
}