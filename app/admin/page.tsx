"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Header } from "@/components/header"
import { FloatingChat } from "@/components/floating-chat"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Trash2, Edit3, Plus, UserPlus, Upload, FileText, Users, Trophy, Database, Wrench, Share2, Play, Check, AlertTriangle, Ban } from "lucide-react"
import { getAllTeams, initializeDefaultTeams, type F1Team } from "@/lib/default-teams"
import { getTeamIdFromName, getAllDrivers, initializeDefaultDrivers } from "@/lib/default-drivers"
import { getAllRaces, initializeDefaultRaces, type F1Race } from "@/lib/default-races"
import { sendReclamoStatusChangeMessage, getAllTeamUsers, sendInspectionScheduledMessage, sendInspectionProgressMessage, sendInspectionResultMessage } from "@/lib/messaging-utils"

export default function AdminPage() {
  const { user, getAllUsers, updateUser, deleteUser, createUser } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [roleInput, setRoleInput] = useState<"usuario" | "escuderia" | "administrador">("usuario")

  // Función helper para formatear fechas de forma segura
  const formatDate = (dateValue: any) => {
    if (!dateValue) return null
    const date = new Date(dateValue)
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('es-ES')
  }
  
  // Estados para crear nuevo usuario
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<"usuario" | "escuderia" | "administrador">("usuario")

  // Estados para carga de información
  const [isLoadingTeamsData, setIsLoadingTeamsData] = useState(false)
  const [isLoadingFiaData, setIsLoadingFiaData] = useState(false)
  const [isLoadingEventsData, setIsLoadingEventsData] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<{
    teams?: string
    fia?: string
    events?: string
  }>({})

  // Estados para formularios manuales
  const [showEventForm, setShowEventForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showDriverForm, setShowDriverForm] = useState(false)
  const [showFiaForm, setShowFiaForm] = useState(false)

  // Estados para datos cargados
  const [events, setEvents] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [fiaData, setFiaData] = useState<any[]>([])
  // Resultados de carreras
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
    createdAt: string
  }
  const RACES_KEY = "f1_races_results"
  const [races, setRaces] = useState<Race[]>([])

  // Inspecciones (controles técnicos y de neumáticos)
  type InspectionStatus = "programado" | "en_progreso" | "completado" | "observacion" | "sancion"
  type InspectionType = "neumaticos" | "tecnica"
  interface Inspection {
    id: string
    type: InspectionType
    eventId?: string
    eventName: string
    teamId: string
    teamName: string
    teamUserId: string // usuario receptor de notificaciones
    scheduledAt: string
    performedAt?: string
    inspector: string
    status: InspectionStatus
    parameters?: Record<string, any>
    resultsSummary?: string
    sharedWithTeam?: boolean
    attachments?: string[]
    createdAt: string
    updatedAt: string
  }
  const INSPECTIONS_KEY = "f1_fia_inspections"
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [showInspectionForm, setShowInspectionForm] = useState(false)
  const [inspectionType, setInspectionType] = useState<InspectionType>("neumaticos")
  const [inspectionEventId, setInspectionEventId] = useState("")
  const [inspectionEventName, setInspectionEventName] = useState("")
  const [inspectionTeamId, setInspectionTeamId] = useState("")
  const [inspectionTeamUserId, setInspectionTeamUserId] = useState("")
  const [inspectionDatetime, setInspectionDatetime] = useState("")
  const [inspectionInspector, setInspectionInspector] = useState("")
  const [inspectionParams, setInspectionParams] = useState<Record<string, any>>({})
  const [inspectionResultDraft, setInspectionResultDraft] = useState("")
  const [inspectionFilter, setInspectionFilter] = useState<"activos" | "todos">("activos")
  const [inspectionTypeFilter, setInspectionTypeFilter] = useState<"todos" | InspectionType>("todos")

  // Helper para actualizar inspecciones y disparar evento
  const updateInspections = (newInspections: Inspection[]) => {
    setInspections(newInspections)
    localStorage.setItem(INSPECTIONS_KEY, JSON.stringify(newInspections))
    window.dispatchEvent(new Event("f1-inspections-updated"))
  }

  // Estados para formularios de eventos
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventCircuit, setEventCircuit] = useState("")
  const [eventCountry, setEventCountry] = useState("")
  const [eventImage, setEventImage] = useState("")

  // Estados para formularios de escuderías
  const [teamName, setTeamName] = useState("")
  const [teamCountry, setTeamCountry] = useState("")
  const [teamPrincipal, setTeamPrincipal] = useState("")
  const [teamImageUrl, setTeamImageUrl] = useState("")

  // Estados para formularios de pilotos
  const [driverName, setDriverName] = useState("")
  const [driverTeam, setDriverTeam] = useState("")
  const [driverNationality, setDriverNationality] = useState("")
  const [driverNumber, setDriverNumber] = useState("")
  const [driverImage, setDriverImage] = useState("")
  const [driverRoleInput, setDriverRoleInput] = useState<"titular" | "suplente" | "reserva">("titular")

  // Estados para formularios de FIA
  const [fiaTitle, setFiaTitle] = useState("")
  const [fiaCategory, setFiaCategory] = useState("")
  const [fiaDescription, setFiaDescription] = useState("")
  const [fiaDate, setFiaDate] = useState("")

  // Estados para fechas
  const [teamDate, setTeamDate] = useState("")

  // Reclamos FIA
  type ClaimStatus = "pendiente" | "en revision" | "aceptado" | "rechazado"
  interface FiaClaim {
    id: string
    teamId: string
    teamName: string
    userId: string // ID del usuario que creó el reclamo
    type: string
    reference?: string
    event?: string
    driver?: string
    description: string
    evidence?: string
    status: ClaimStatus
    createdAt: string
    updatedAt: string
  }
  const CLAIMS_KEY = "f1_fia_claims"
  const [claims, setClaims] = useState<FiaClaim[]>([])
  const [showOnlyPending, setShowOnlyPending] = useState(true)

  useEffect(() => {
    // Debug: verificar el estado del usuario
    console.log("Admin page - User:", user)
    console.log("Admin page - User role:", user?.user_role)
    
    if (!user) {
      console.log("No user found, redirecting to login")
      router.push("/login")
      return
    }

    if (user.user_role !== "administrador") {
      console.log("User is not admin, redirecting to home")
      router.push("/")
      return
    }

    console.log("User is admin, loading data")
    setUsers(getAllUsers())
    
  // Inicializar escuderías y pilotos por defecto
    initializeDefaultTeams()
  initializeDefaultDrivers()
    
  // Cargar datos manuales desde localStorage
    const storedEvents = localStorage.getItem('f1_events_manual')
    // Drivers (defaults + manuales + ediciones)
    const storedFiaData = localStorage.getItem('f1_fia_manual')
    
    // Obtener todas las escuderías (por defecto + manuales)
    const allTeams = getAllTeams()
    
    if (storedEvents) setEvents(JSON.parse(storedEvents))
    setTeams(allTeams) // Usar todas las escuderías
    setDrivers(getAllDrivers())
    if (storedFiaData) setFiaData(JSON.parse(storedFiaData))

    // Cargar inspecciones
    const storedInspections = localStorage.getItem(INSPECTIONS_KEY)
    if (storedInspections) {
      try {
        const parsed: Inspection[] = JSON.parse(storedInspections)
        setInspections(parsed.sort((a,b)=> (b.createdAt > a.createdAt ? 1 : -1)))
      } catch {}
    }

    // Cargar carreras/resultados
    try {
      const storedRaces = localStorage.getItem(RACES_KEY)
      if (storedRaces) {
        const parsed: Race[] = JSON.parse(storedRaces)
        // normalizar: asegurar 20 posiciones
        const normalized = parsed.map(r => ({
          ...r,
          results: Array.from({ length: 20 }, (_, i) => {
            const existing = r.results?.find(rr => rr.position === i + 1)
            return existing || { position: i + 1, driver: "", number: "", team: "" }
          })
        }))
        setRaces(normalized)
      }
    } catch {}
    
    // Cargar las fechas de última actualización desde localStorage
    const teamsData = localStorage.getItem('f1_teams_data')
    const fiaDataAuto = localStorage.getItem('f1_fia_data')
    const eventsData = localStorage.getItem('f1_events_data')
    
    const updates: any = {}
    
    if (teamsData) {
      updates.teams = localStorage.getItem('f1_teams_last_update') || 'Datos cargados anteriormente'
    }
    if (fiaDataAuto) {
      updates.fia = localStorage.getItem('f1_fia_last_update') || 'Datos cargados anteriormente'
    }
    if (eventsData) {
      updates.events = localStorage.getItem('f1_events_last_update') || 'Datos cargados anteriormente'
    }
    
    setLastUpdate(updates)

    // Cargar reclamos
    const storedClaims = localStorage.getItem(CLAIMS_KEY)
    if (storedClaims) {
      try {
        const parsed: FiaClaim[] = JSON.parse(storedClaims)
        // Migración: convertir 'revisado' -> 'aceptado'
        const hasRevisado = parsed.some(c => (c as any).status === "revisado")
        const migrated: FiaClaim[] = parsed.map((c) => {
          const status = (c.status === ("revisado" as any) ? "aceptado" : c.status) as ClaimStatus
          return { ...c, status }
        })
        if (hasRevisado) {
          localStorage.setItem(CLAIMS_KEY, JSON.stringify(migrated))
          try { window.dispatchEvent(new Event("f1-fia-claims-updated")) } catch {}
        }
        setClaims(migrated.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)))
      } catch {}
    }

    // Notificación en tiempo real de nuevos reclamos
  const baseList: FiaClaim[] = storedClaims ? JSON.parse(storedClaims) : []
  const prevIds = new Set(baseList.map(c => c.id))
    const onClaimsUpdated = () => {
      const s = localStorage.getItem(CLAIMS_KEY)
      if (!s) return
      try {
        const p: FiaClaim[] = JSON.parse(s)
        setClaims(p.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)))
        const newOnes = p.filter(c => !prevIds.has(c.id))
        if (newOnes.length > 0) {
          const newest = newOnes[0]
          toast({ title: "Nuevo reclamo", description: `${newest.teamName}: ${newest.type.replace(/_/g, " ")}` })
          newOnes.forEach(n => prevIds.add(n.id))
        }
      } catch {}
    }
    window.addEventListener("f1-fia-claims-updated", onClaimsUpdated)
    return () => window.removeEventListener("f1-fia-claims-updated", onClaimsUpdated)
  }, [user])

  const startEdit = (u: any) => {
    setEditingId(u.id)
    setNameInput(u.name)
    setRoleInput(u.user_role)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNameInput("")
  }

  const saveEdit = () => {
    if (!editingId) return
    updateUser(editingId, nameInput, roleInput)
    setUsers(getAllUsers())
    cancelEdit()
  }

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return
    deleteUser(id)
    setUsers(getAllUsers())
  }

  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert("Por favor completa todos los campos")
      return
    }

    const success = createUser(newUserName.trim(), newUserEmail.trim(), newUserRole)
    
    if (success) {
      alert("Usuario creado exitosamente")
      setUsers(getAllUsers())
      // Limpiar formulario
      setShowCreateForm(false)
    } else {
      alert("El email ya está registrado")
    }
  }

  const cancelCreateUser = () => {
    setShowCreateForm(false)
  }

  // Funciones para manejo de eventos
  const handleCreateEvent = () => {
    if (!eventName.trim() || !eventDate || !eventCircuit.trim() || !eventCountry.trim()) {
      alert("Por favor completa todos los campos del evento")
      return
    }

    const newEvent = {
      id: Date.now().toString(),
      name: eventName.trim(),
      date: eventDate,
      circuit: eventCircuit.trim(),
      country: eventCountry.trim(),
      image: eventImage || "/placeholder.svg",
      created: new Date().toLocaleString()
    }

    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    localStorage.setItem('f1_events_manual', JSON.stringify(updatedEvents))
    
    // Disparar evento para actualizar el calendario
    try {
      window.dispatchEvent(new Event('f1-events-updated'))
    } catch (e) {
      console.log('No se pudo disparar evento f1-events-updated')
    }
    
    // Limpiar formulario
    setEventName("")
    setEventDate("")
    setEventCircuit("")
    setEventCountry("")
    setEventImage("")
    setShowEventForm(false)
    
    alert("Evento creado exitosamente")
  }

  // Funciones para manejo de escuderías
  const handleCreateTeam = () => {
    if (!teamName.trim() || !teamCountry.trim() || !teamPrincipal.trim() || !teamDate) {
      alert("Por favor completa todos los campos de la escudería")
      return
    }

    const newTeam = {
      id: Date.now().toString(),
      name: teamName.trim(),
      country: teamCountry.trim(),
      principal: teamPrincipal.trim(),
      date: teamDate,
      created: new Date().toLocaleString(),
      imageUrl: teamImageUrl.trim() || undefined
    }

    // Solo agregar a las escuderías manuales, no a todas
    const storedManualTeams = localStorage.getItem('f1_teams_manual')
    const manualTeams = storedManualTeams ? JSON.parse(storedManualTeams) : []
    const updatedManualTeams = [...manualTeams, newTeam]
    
    // Actualizar localStorage solo con escuderías manuales
    localStorage.setItem('f1_teams_manual', JSON.stringify(updatedManualTeams))
    
    // Actualizar estado con todas las escuderías
    const allTeams = getAllTeams()
    setTeams(allTeams)
    
    // Limpiar formulario
    setTeamName("")
    setTeamCountry("")
    setTeamPrincipal("")
    setTeamDate("")
    setTeamImageUrl("")
    setShowTeamForm(false)
    
    alert("Escudería creada exitosamente")
  }

  // Funciones para manejo de pilotos
  const handleCreateDriver = () => {
    if (!driverName.trim() || !driverTeam.trim() || !driverNationality.trim() || !driverNumber.trim()) {
      alert("Por favor completa todos los campos del piloto")
      return
    }

    // Buscar teamId usando la función de mapeo
    const teamId = getTeamIdFromName(driverTeam.trim())

    const newDriver = {
      id: Date.now().toString(),
      name: driverName.trim(),
      number: String(driverNumber),
      team: driverTeam.trim(),
      teamId,
      nationality: driverNationality.trim(),
      country: '',
      image: driverImage || '/placeholder-user.jpg',
      points: 0,
      status: driverRoleInput,
      role: undefined,
      biography: undefined,
      achievements: undefined,
      socialMedia: undefined,
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }

    // Guardar como manual (para que getAllDrivers lo combine con defaults)
    const storedManual = localStorage.getItem('f1_drivers_manual')
    const manualList = storedManual ? JSON.parse(storedManual) : []
    const updatedManual = [newDriver, ...manualList]
    localStorage.setItem('f1_drivers_manual', JSON.stringify(updatedManual))
    setDrivers(getAllDrivers())
    // Limpiar formulario
    setDriverName("")
    setDriverTeam("")
    setDriverNationality("")
    setDriverNumber("")
    setDriverImage("")
    setDriverRoleInput("titular")
    setShowDriverForm(false)

    // Disparar evento para que otras partes (drivers-section, escuderia) recarguen
    try { window.dispatchEvent(new Event('f1-drivers-updated')) } catch {}

    alert("Piloto creado exitosamente")
  }

  // Funciones para manejo de datos FIA
  const handleCreateFiaData = () => {
    if (!fiaTitle.trim() || !fiaCategory.trim() || !fiaDescription.trim() || !fiaDate) {
      alert("Por favor completa todos los campos de FIA")
      return
    }

    const newFiaData = {
      id: Date.now().toString(),
      title: fiaTitle.trim(),
      category: fiaCategory.trim(),
      description: fiaDescription.trim(),
      date: fiaDate,
      created: new Date().toLocaleString()
    }

    const updatedFiaData = [...fiaData, newFiaData]
    setFiaData(updatedFiaData)
    localStorage.setItem('f1_fia_manual', JSON.stringify(updatedFiaData))
    
    // Limpiar formulario
    setFiaTitle("")
    setFiaCategory("")
    setFiaDescription("")
    setFiaDate("")
    setShowFiaForm(false)
    
    alert("Dato FIA creado exitosamente")
  }

  // Funciones para eliminar datos
  const handleDeleteEvent = (id: string) => {
    if (!confirm("¿Eliminar este evento?")) return
    const updatedEvents = events.filter(e => e.id !== id)
    setEvents(updatedEvents)
    localStorage.setItem('f1_events_manual', JSON.stringify(updatedEvents))
    
    // Disparar evento para actualizar el calendario
    try {
      window.dispatchEvent(new Event('f1-events-updated'))
    } catch (e) {
      console.log('No se pudo disparar evento f1-events-updated')
    }
  }

  const handleDeleteTeam = (id: string) => {
    if (!confirm("¿Eliminar esta escudería?")) return
    
    // Solo eliminar de las escuderías manuales
    const storedManualTeams = localStorage.getItem('f1_teams_manual')
    const manualTeams = storedManualTeams ? JSON.parse(storedManualTeams) : []
    const updatedManualTeams = manualTeams.filter((t: any) => t.id !== id)
    
    localStorage.setItem('f1_teams_manual', JSON.stringify(updatedManualTeams))
    
    // Actualizar estado con todas las escuderías
    const allTeams = getAllTeams()
    setTeams(allTeams)
  }

  const handleDeleteDriver = (id: string) => {
    if (!confirm("¿Eliminar este piloto?")) return
    // Solo eliminar de los manuales
    const storedManual = localStorage.getItem('f1_drivers_manual')
    const manualList = storedManual ? JSON.parse(storedManual) : []
    const nextManual = manualList.filter((d: any) => d.id !== id)
    localStorage.setItem('f1_drivers_manual', JSON.stringify(nextManual))
    setDrivers(getAllDrivers())
    try { window.dispatchEvent(new Event('f1-drivers-updated')) } catch {}
  }

  const handleDeleteFiaData = (id: string) => {
    if (!confirm("¿Eliminar este dato FIA?")) return
    const updatedFiaData = fiaData.filter(f => f.id !== id)
    setFiaData(updatedFiaData)
    localStorage.setItem('f1_fia_manual', JSON.stringify(updatedFiaData))
  }

  // ---------- Gestión de Resultados de Carreras ----------
  const [selectedRaceId, setSelectedRaceId] = useState("")
  const [availableRaces, setAvailableRaces] = useState<F1Race[]>([])

  // Cargar carreras disponibles
  useEffect(() => {
    initializeDefaultRaces()
    const loadAvailableRaces = () => {
      const races = getAllRaces()
      setAvailableRaces(races)
    }
    
    loadAvailableRaces()
    
    // Escuchar cambios
    const handleRacesUpdate = () => {
      loadAvailableRaces()
    }
    
    window.addEventListener('f1-events-updated', handleRacesUpdate)
    return () => window.removeEventListener('f1-events-updated', handleRacesUpdate)
  }, [])

  const getPointsForPosition = (pos: number) => {
    const table = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
    return table[pos - 1] || 0
  }

  const saveRacesToStorage = (next: Race[]) => {
    setRaces(next)
    try { localStorage.setItem(RACES_KEY, JSON.stringify(next)) } catch {}
    try { window.dispatchEvent(new Event("f1-races-updated")) } catch {}
  }

  const handleSelectRace = (raceId: string) => {
    setSelectedRaceId(raceId)
    
    // Buscar si ya existen resultados para esta carrera
    const existingRace = races.find(r => r.id === raceId)
    if (!existingRace) {
      // Si no existe, crear una nueva entrada de resultados
      const selectedF1Race = availableRaces.find(r => r.id === raceId)
      if (selectedF1Race) {
        const race: Race = {
          id: raceId,
          name: selectedF1Race.name,
          date: selectedF1Race.fullDate,
          results: Array.from({ length: 20 }, (_, i) => ({ position: i + 1, driver: "", number: "", team: "" })),
          createdAt: new Date().toISOString()
        }
        const next = [race, ...races]
        saveRacesToStorage(next)
      }
    }
  }

  const handleClearRaceResults = (raceId: string) => {
    if (!confirm("¿Limpiar todos los resultados de esta carrera?")) return
    const next = races.map(r => {
      if (r.id !== raceId) return r
      return {
        ...r,
        results: Array.from({ length: 20 }, (_, i) => ({ position: i + 1, driver: "", number: "", team: "" }))
      }
    })
    saveRacesToStorage(next)
  }

  const updateRaceField = (raceId: string, position: number, field: keyof RaceDriverResult, value: string) => {
    const next = races.map(r => {
      if (r.id !== raceId) return r
      const results = r.results.map(rr => rr.position === position ? { ...rr, [field]: value } : rr)
      return { ...r, results }
    })
    setRaces(next) // no persistir en cada tecla; usuario guardará manualmente
  }

  const updateDriverSelection = (raceId: string, position: number, driverId: string) => {
    const selectedDriver = drivers.find(d => d.id === driverId)
    
    if (selectedDriver) {
      const next = races.map(r => {
        if (r.id !== raceId) return r
        const results = r.results.map(rr => 
          rr.position === position 
            ? { 
                ...rr, 
                driver: selectedDriver.name,
                number: selectedDriver.number || "",
                team: selectedDriver.team || ""
              } 
            : rr
        )
        return { ...r, results }
      })
      setRaces(next)
    } else {
      // Si no se encuentra el piloto (campo vacío), limpiar los campos
      updateRaceField(raceId, position, "driver", "")
      updateRaceField(raceId, position, "number", "")
      updateRaceField(raceId, position, "team", "")
    }
  }

  const handleSaveRace = (raceId: string) => {
    // limpiar espacios y posiciones sin driver
    const next = races.map(r => {
      if (r.id !== raceId) return r
      const results = r.results.map(rr => ({ ...rr, driver: rr.driver.trim() }))
      return { ...r, results }
    })
    saveRacesToStorage(next)
    alert("Resultados guardados")
  }

  // Funciones para cargar información
  const loadTeamsAndDriversData = async () => {
    setIsLoadingTeamsData(true)
    try {
      // Simular carga de datos de escuderías y pilotos
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aquí se conectaría con la API real para cargar datos
      const mockData = {
        teams: [
          { id: 1, name: "Red Bull Racing", country: "Austria", drivers: ["Max Verstappen", "Sergio Pérez"] },
          { id: 2, name: "Ferrari", country: "Italy", drivers: ["Charles Leclerc", "Carlos Sainz"] },
          { id: 3, name: "Mercedes", country: "Germany", drivers: ["Lewis Hamilton", "George Russell"] }
        ],
        drivers: [
          { id: 1, name: "Max Verstappen", team: "Red Bull Racing", nationality: "Dutch", points: 575 },
          { id: 2, name: "Sergio Pérez", team: "Red Bull Racing", nationality: "Mexican", points: 285 }
        ]
      }
      
      // Guardar en localStorage para simular persistencia
      localStorage.setItem('f1_teams_data', JSON.stringify(mockData))
      const teamsUpdateTime = new Date().toLocaleString()
      localStorage.setItem('f1_teams_last_update', teamsUpdateTime)
      
      setLastUpdate(prev => ({ ...prev, teams: teamsUpdateTime }))
      alert("Datos de escuderías y pilotos cargados exitosamente")
    } catch (error) {
      alert("Error al cargar datos de escuderías y pilotos")
    } finally {
      setIsLoadingTeamsData(false)
    }
  }

  const loadFiaData = async () => {
    setIsLoadingFiaData(true)
    try {
      // Simular carga de datos de FIA
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockFiaData = {
        regulations: [
          { id: 1, title: "Reglamento Técnico 2024", category: "Técnico", lastUpdated: "2024-01-15" },
          { id: 2, title: "Reglamento Deportivo 2024", category: "Deportivo", lastUpdated: "2024-02-01" }
        ],
        penalties: [
          { id: 1, driver: "Max Verstappen", reason: "Velocidad en pit lane", penalty: "5 segundos", race: "Bahrain GP" },
          { id: 2, driver: "Lewis Hamilton", reason: "Límites de pista", penalty: "5 segundos", race: "Saudi Arabia GP" }
        ],
        stewards: [
          { id: 1, name: "Derek Warwick", role: "Comisario Principal", nationality: "British" },
          { id: 2, name: "Garry Connelly", role: "Comisario", nationality: "Australian" }
        ]
      }
      
      localStorage.setItem('f1_fia_data', JSON.stringify(mockFiaData))
      const fiaUpdateTime = new Date().toLocaleString()
      localStorage.setItem('f1_fia_last_update', fiaUpdateTime)
      
      setLastUpdate(prev => ({ ...prev, fia: fiaUpdateTime }))
      alert("Datos de FIA cargados exitosamente")
    } catch (error) {
      alert("Error al cargar datos de FIA")
    } finally {
      setIsLoadingFiaData(false)
    }
  }

  const loadEventsAndRacesData = async () => {
    setIsLoadingEventsData(true)
    try {
      // Simular carga de datos de eventos y carreras
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      const mockEventsData = {
        races: [
          { 
            id: 1, 
            name: "Bahrain Grand Prix", 
            circuit: "Bahrain International Circuit", 
            date: "2024-03-02", 
            country: "Bahrain",
            sessions: {
              fp1: "2024-03-01 14:30",
              fp2: "2024-03-01 18:00", 
              fp3: "2024-03-02 14:30",
              qualifying: "2024-03-02 18:00",
              race: "2024-03-03 18:00"
            }
          },
          {
            id: 2,
            name: "Saudi Arabian Grand Prix",
            circuit: "Jeddah Corniche Circuit",
            date: "2024-03-09",
            country: "Saudi Arabia",
            sessions: {
              fp1: "2024-03-08 14:30",
              fp2: "2024-03-08 18:00",
              fp3: "2024-03-09 14:30", 
              qualifying: "2024-03-09 18:00",
              race: "2024-03-10 20:00"
            }
          }
        ],
        calendar: [
          { round: 1, date: "2024-03-02", race: "Bahrain Grand Prix" },
          { round: 2, date: "2024-03-09", race: "Saudi Arabian Grand Prix" },
          { round: 3, date: "2024-03-24", race: "Australian Grand Prix" }
        ]
      }
      
      localStorage.setItem('f1_events_data', JSON.stringify(mockEventsData))
      const eventsUpdateTime = new Date().toLocaleString()
      localStorage.setItem('f1_events_last_update', eventsUpdateTime)
      
      setLastUpdate(prev => ({ ...prev, events: eventsUpdateTime }))
      alert("Datos de eventos y carreras cargados exitosamente")
    } catch (error) {
      alert("Error al cargar datos de eventos y carreras")
    } finally {
      setIsLoadingEventsData(false)
    }
  }

  // Acciones sobre reclamos
  const updateClaimStatus = (id: string, status: ClaimStatus) => {
    const stored = localStorage.getItem(CLAIMS_KEY)
    const all: FiaClaim[] = stored ? JSON.parse(stored) : []
    const claim = all.find(c => c.id === id)
    
    if (!claim || !user) return
    
    const now = new Date().toISOString()
    const updatedClaim = { ...claim, status, updatedAt: now }
    const updated = all.map(c => (c.id === id ? updatedClaim : c))
    
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(updated))
    setClaims(updated.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)))
    
    // Enviar mensaje automático a la escudería sobre el cambio de estado
    console.log("Actualizando estado de reclamo:", {
      claimId: id,
      newStatus: status,
      claim: updatedClaim,
      admin: user.name
    })
    
    sendReclamoStatusChangeMessage(updatedClaim, status, user)
    
    try { window.dispatchEvent(new Event("f1-fia-claims-updated")) } catch {}
  }

  const pendingCount = claims.filter(c => c.status === "pendiente").length
  const activeInspectionsCount = inspections.filter(i => i.status === "programado" || i.status === "en_progreso").length

  // Si no hay usuario, mostrar pantalla de carga
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no es administrador, mostrar acceso denegado
  if (user.user_role !== "administrador") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>Acceso denegado</p>
          <p className="text-sm text-muted-foreground">
            Su rol actual: {user.user_role} - Necesita rol: "administrador"
          </p>
          <p className="text-sm text-muted-foreground">
            Usuario: {user.name} ({user.email})
          </p>
          <Button onClick={() => router.push("/")}>
            Volver al Inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header/>
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Panel de administración</h1>
            {pendingCount > 0 && (
              <Badge className="ml-2 bg-blue-600 text-white">{pendingCount} reclamo(s) pendiente(s)</Badge>
            )}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Gestión de usuarios</CardTitle>
              <Button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Crear Usuario
              </Button>
            </CardHeader>
            <CardContent>
              {/* Formulario para crear nuevo usuario */}
              {showCreateForm && (
                <div className="border rounded-lg p-4 mb-6 bg-muted/50">
                  <h3 className="text-lg font-semibold mb-3">Crear nuevo usuario</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="newUserName">Nombre</Label>
                      <Input
                        id="newUserName"
                        placeholder="Nombre del usuario"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newUserEmail">Email</Label>
                      <Input
                        id="newUserEmail"
                        type="email"
                        placeholder="email@ejemplo.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newUserRole">Rol</Label>
                      <select 
                        id="newUserRole"
                        value={newUserRole} 
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                      >
                        <option value="usuario">Usuario</option>
                        <option value="escuderia">Escudería</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button onClick={handleCreateUser} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Crear Usuario
                    </Button>
                    <Button variant="outline" onClick={cancelCreateUser}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {users.length === 0 && <p className="text-sm text-muted-foreground">No hay usuarios.</p>}

                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between gap-4 border-b py-3">
                    <div className="flex-1">
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email} — {u.user_role}</div>
                    </div>

                    {editingId === u.id ? (
                      <div className="flex items-center gap-2">
                        <Input value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-40" />
                        <select value={roleInput} onChange={(e) => setRoleInput(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                          <option value="usuario">Usuario</option>
                          <option value="escuderia">Escudería</option>
                          <option value="administrador">Administrador</option>
                        </select>
                        <Button size="sm" onClick={saveEdit}>Guardar</Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancelar</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(u)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Controles Técnicos y Neumáticos
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="text-xs">{activeInspectionsCount} activos</Badge>
                <Button size="sm" onClick={() => setShowInspectionForm(!showInspectionForm)}>
                  <Plus className="h-4 w-4 mr-2" /> Programar Control
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulario nueva inspección */}
              {showInspectionForm && (
                <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                  <h4 className="font-semibold">Nueva Inspección</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Tipo</Label>
                      <select value={inspectionType} onChange={(e)=>setInspectionType(e.target.value as InspectionType)} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                        <option value="neumaticos">Neumáticos</option>
                        <option value="tecnica">Técnica</option>
                      </select>
                    </div>
                    <div>
                      <Label>Evento</Label>
                      <select
                        value={inspectionEventId}
                        onChange={(e)=>{
                          const id = e.target.value
                          setInspectionEventId(id)
                          const ev = events.find(ev=>ev.id === id)
                          setInspectionEventName(ev ? ev.name : "")
                        }}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                      >
                        <option value="">Seleccionar evento</option>
                        {events.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Escudería</Label>
                      <select
                        value={inspectionTeamId}
                        onChange={(e)=>setInspectionTeamId(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                      >
                        <option value="">Seleccionar escudería</option>
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Usuario de la escudería (destinatario)</Label>
                      <select
                        value={inspectionTeamUserId}
                        onChange={(e)=>setInspectionTeamUserId(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                      >
                        <option value="">Seleccionar usuario</option>
                        {getAllTeamUsers().map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Fecha y hora programada</Label>
                      <Input type="datetime-local" value={inspectionDatetime} onChange={(e)=>setInspectionDatetime(e.target.value)} />
                    </div>
                    <div>
                      <Label>Inspector</Label>
                      <Input value={inspectionInspector} onChange={(e)=>setInspectionInspector(e.target.value)} placeholder="Nombre del inspector" />
                    </div>
                  </div>

                  {/* Parámetros según tipo */}
                  {inspectionType === "neumaticos" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Compuesto</Label>
                        <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={inspectionParams.compound || ""} onChange={(e)=>setInspectionParams(p=>({...p, compound: e.target.value}))}>
                          <option value="">Seleccionar</option>
                          {['dry','inter','wet'].map(c=> <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label>Juegos sellados</Label>
                        <Input type="number" value={inspectionParams.setsSealed ?? ''} onChange={(e)=>setInspectionParams(p=>({...p, setsSealed: Number(e.target.value)}))} />
                      </div>
                      <div>
                        <Label>Juegos usados</Label>
                        <Input type="number" value={inspectionParams.setsUsed ?? ''} onChange={(e)=>setInspectionParams(p=>({...p, setsUsed: Number(e.target.value)}))} />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={!!inspectionParams.pressuresOk} onChange={(e)=>setInspectionParams(p=>({...p, pressuresOk: e.target.checked}))} />
                        <Label>Presiones OK</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={!!inspectionParams.tempsOk} onChange={(e)=>setInspectionParams(p=>({...p, tempsOk: e.target.checked}))} />
                        <Label>Temperaturas OK</Label>
                      </div>
                      <div className="md:col-span-3">
                        <Label>Comentarios</Label>
                        <Input value={inspectionParams.comments || ""} onChange={(e)=>setInspectionParams(p=>({...p, comments: e.target.value}))} placeholder="Notas del control" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      <div>
                        <Label>Peso (kg)</Label>
                        <Input type="number" value={inspectionParams.weight ?? ''} onChange={(e)=>setInspectionParams(p=>({...p, weight: Number(e.target.value)}))} />
                      </div>
                  
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={!!inspectionParams.wingsLegal} onChange={(e)=>setInspectionParams(p=>({...p, wingsLegal: e.target.checked}))} />
                        <Label>Alerones legales</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={!!inspectionParams.drsOk} onChange={(e)=>setInspectionParams(p=>({...p, drsOk: e.target.checked}))} />
                        <Label>DRS OK</Label>
                      </div>
                      <div className="md:col-span-3">
                        <Label>Comentarios</Label>
                        <Input value={inspectionParams.comments || ""} onChange={(e)=>setInspectionParams(p=>({...p, comments: e.target.value}))} placeholder="Observaciones técnicas" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => {
                      if (!inspectionType || !inspectionTeamId || !inspectionTeamUserId || !inspectionDatetime) {
                        alert("Completa tipo, escudería, usuario y fecha/hora")
                        return
                      }
                      const team = teams.find(t=>t.id===inspectionTeamId)
                      const eventName = inspectionEventName || (events.find(ev=>ev.id===inspectionEventId)?.name ?? "")
                      const nowIso = new Date().toISOString()
                      const newI: Inspection = {
                        id: Date.now().toString(),
                        type: inspectionType,
                        eventId: inspectionEventId || undefined,
                        eventName: eventName,
                        teamId: inspectionTeamId,
                        teamName: team?.name || inspectionTeamId,
                        teamUserId: inspectionTeamUserId,
                        scheduledAt: inspectionDatetime,
                        inspector: inspectionInspector || (user?.name || "FIA"),
                        status: "programado",
                        parameters: inspectionParams,
                        createdAt: nowIso,
                        updatedAt: nowIso
                      }
                      const updated = [newI, ...inspections]
                      updateInspections(updated)
                      // Notificar a escudería
                      if (user) {
                        sendInspectionScheduledMessage(newI as any, user as any, newI.teamUserId)
                      }
                      // limpiar
                      setShowInspectionForm(false)
                      setInspectionParams({})
                      setInspectionInspector("")
                      setInspectionDatetime("")
                      setInspectionEventId("")
                      setInspectionEventName("")
                      setInspectionTeamId("")
                      setInspectionTeamUserId("")
                      toast({ title: "Control programado", description: `${newI.teamName} - ${newI.eventName || "General"}` })
                    }}>Programar control</Button>
                    <Button size="sm" variant="outline" onClick={()=>setShowInspectionForm(false)}>Cancelar</Button>
                  </div>
                </div>
              )}

              {/* Filtros */}
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm flex items-center gap-2">
                  <input type="radio" checked={inspectionFilter === "activos"} onChange={()=>setInspectionFilter("activos")} /> Activos
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input type="radio" checked={inspectionFilter === "todos"} onChange={()=>setInspectionFilter("todos")} /> Todos
                </label>
                <span className="mx-2 text-muted-foreground">|</span>
                <select value={inspectionTypeFilter} onChange={(e)=>setInspectionTypeFilter(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                  <option value="todos">Todos los tipos</option>
                  <option value="neumaticos">Neumáticos</option>
                  <option value="tecnica">Técnica</option>
                </select>
              </div>

              {/* Lista */}
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {inspections
                  .filter(i => inspectionFilter === "todos" ? true : (i.status === "programado" || i.status === "en_progreso"))
                  .filter(i => inspectionTypeFilter === "todos" ? true : i.type === inspectionTypeFilter)
                  .map(i => (
                    <div key={i.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="text-xs">#{i.id}</Badge>
                          <Badge className="text-xs">{i.type === "neumaticos" ? "Neumáticos" : "Técnica"}</Badge>
                          <span className="text-sm font-medium">{i.teamName}</span>
                          {i.eventName && <span className="text-xs text-muted-foreground">{i.eventName}</span>}
                          <span className="text-xs text-muted-foreground">Prog: {i.scheduledAt ? new Date(i.scheduledAt).toLocaleString() : "-"}</span>
                        </div>
                        <Badge className="text-xs">{i.status.replace("_"," ")}</Badge>
                      </div>
                      {i.resultsSummary && (
                        <div className="mt-1 text-sm whitespace-pre-wrap">{i.resultsSummary}</div>
                      )}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {i.status === "programado" && (
                          <Button size="sm" variant="secondary" onClick={()=>{
                            const updated = inspections.map(x => x.id===i.id ? ({...x, status: "en_progreso" as InspectionStatus, updatedAt: new Date().toISOString()}) : x)
                            updateInspections(updated)
                            if (user) sendInspectionProgressMessage(i as any, user as any, i.teamUserId)
                          }}>
                            <Play className="h-3 w-3 mr-1"/> Iniciar
                          </Button>
                        )}
                        {(i.status === "programado" || i.status === "en_progreso") && (
                          <Button size="sm" onClick={()=>{
                            const res = prompt("Resumen de resultados")
                            const now = new Date().toISOString()
                            const updated = inspections.map(x => x.id===i.id ? ({...x, status: "completado" as InspectionStatus, resultsSummary: res || x.resultsSummary, performedAt: now, updatedAt: now}) : x)
                            updateInspections(updated)
                            if (user) sendInspectionResultMessage({...i, resultsSummary: res, status: "completado", performedAt: now} as any, user as any, i.teamUserId)
                          }}>
                            <Check className="h-3 w-3 mr-1"/> Completar
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={()=>{
                          const detail = prompt("Detalle de observación")
                          const now = new Date().toISOString()
                          const updated = inspections.map(x => x.id===i.id ? ({...x, status: "observacion" as InspectionStatus, resultsSummary: detail || x.resultsSummary, performedAt: now, updatedAt: now}) : x)
                          updateInspections(updated)
                          if (user) sendInspectionResultMessage({...i, resultsSummary: detail, status: "observacion", performedAt: now} as any, user as any, i.teamUserId)
                        }}>
                          <AlertTriangle className="h-3 w-3 mr-1"/> Observación
                        </Button>
                        <Button size="sm" variant="destructive" onClick={()=>{
                          const detail = prompt("Detalle de sanción aplicada")
                          const now = new Date().toISOString()
                          const updated = inspections.map(x => x.id===i.id ? ({...x, status: "sancion" as InspectionStatus, resultsSummary: detail || x.resultsSummary, performedAt: now, updatedAt: now}) : x)
                          updateInspections(updated)
                          if (user) sendInspectionResultMessage({...i, resultsSummary: detail, status: "sancion", performedAt: now} as any, user as any, i.teamUserId)
                        }}>
                          <Ban className="h-3 w-3 mr-1"/> Sanción
                        </Button>
                        <Button size="sm" variant={i.sharedWithTeam ? "secondary" : "outline"} onClick={()=>{
                          const updated = inspections.map(x => x.id===i.id ? ({...x, sharedWithTeam: !x.sharedWithTeam, updatedAt: new Date().toISOString()}) : x)
                          updateInspections(updated)
                          if (!i.sharedWithTeam && user) {
                            sendInspectionResultMessage(i as any, user as any, i.teamUserId)
                            toast({ title: "Resultados compartidos", description: `${i.teamName}` })
                          }
                        }}>
                          <Share2 className="h-3 w-3 mr-1"/> {i.sharedWithTeam ? "Compartido" : "Compartir"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={()=>{
                          if (!confirm("¿Eliminar control?")) return
                          const updated = inspections.filter(x => x.id !== i.id)
                          updateInspections(updated)
                        }}>
                          <Trash2 className="h-3 w-3"/>
                        </Button>
                      </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>


          {/* Sección de gestión manual de información */}
          {/* Gestión de Reclamos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reclamos de Escuderías
              </CardTitle>
              <div className="flex items-center gap-3">
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showOnlyPending}
                    onChange={(e) => setShowOnlyPending(e.target.checked)}
                  />
                  Mostrar solo pendientes
                </label>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {claims.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay reclamos.</p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {claims
                    .filter(c => (showOnlyPending ? c.status === "pendiente" : true))
                    .map((c) => (
                    <div key={c.id} className="p-3 border rounded-md space-y-2">
                      <div className="flex flex-wrap items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="text-xs">#{c.id}</Badge>
                          <Badge className="text-xs">{c.teamName}</Badge>
                          <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <Badge className="text-xs">
                          {c.status}
                        </Badge>
                      </div>
                      <div className="text-sm"><span className="font-medium">Tipo:</span> {c.type.replace(/_/g, " ")}</div>
                      {c.reference && <div className="text-xs text-muted-foreground">Ref: {c.reference}</div>}
                      <div className="text-sm whitespace-pre-wrap">{c.description}</div>
                      <div className="grid md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                        {c.event && <div>Evento: {c.event}</div>}
                        {c.driver && <div>Piloto: {c.driver}</div>}
                        {c.evidence && <div className="truncate" title={c.evidence}>Evidencia: {c.evidence}</div>}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="secondary" onClick={() => updateClaimStatus(c.id, "en revision")}>En revisión</Button>
                        <Button size="sm" onClick={() => updateClaimStatus(c.id, "aceptado")}>Aceptar</Button>
                        <Button size="sm" variant="destructive" onClick={() => updateClaimStatus(c.id, "rechazado")}>Rechazar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gestión de Eventos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Eventos y Carreras
                </CardTitle>
                <Button 
                  onClick={() => setShowEventForm(!showEventForm)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Evento
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulario para crear evento */}
                {showEventForm && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-semibold mb-3">Nuevo Evento</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="eventName">Nombre del Evento</Label>
                        <Input
                          id="eventName"
                          placeholder="Ej: Monaco Grand Prix"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventDate">Fecha</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventCircuit">Circuito</Label>
                        <Input
                          id="eventCircuit"
                          placeholder="Ej: Circuit de Monaco"
                          value={eventCircuit}
                          onChange={(e) => setEventCircuit(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventCountry">País</Label>
                        <Input
                          id="eventCountry"
                          placeholder="Ej: Monaco"
                          value={eventCountry}
                          onChange={(e) => setEventCountry(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventImage">URL de la Imagen</Label>
                        <Input
                          id="eventImage"
                          placeholder="Ej: https://ejemplo.com/imagen.jpg o /imagen.jpg"
                          value={eventImage}
                          onChange={(e) => setEventImage(e.target.value)}
                        />
                        {eventImage && (
                          <div className="mt-2">
                            <img 
                              src={eventImage} 
                              alt="Preview" 
                              className="w-20 h-12 object-cover rounded border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateEvent} size="sm">Crear Evento</Button>
                        <Button variant="outline" onClick={() => setShowEventForm(false)} size="sm">Cancelar</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de eventos */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {events.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay eventos registrados</p>
                  ) : (
                    events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {event.image && (
                            <img 
                              src={event.image} 
                              alt={event.name}
                              className="w-12 h-8 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{event.date} - {event.circuit}, {event.country}</p>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Escuderías */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Escuderías
                </CardTitle>
                <Button 
                  onClick={() => setShowTeamForm(!showTeamForm)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Escudería
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulario para crear escudería */}
                {showTeamForm && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-semibold mb-3">Nueva Escudería</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="teamName">Nombre de la Escudería</Label>
                        <Input
                          id="teamName"
                          placeholder="Ej: Ferrari"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="teamCountry">País</Label>
                        <Input
                          id="teamCountry"
                          placeholder="Ej: Italy"
                          value={teamCountry}
                          onChange={(e) => setTeamCountry(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="teamPrincipal">Director de Equipo</Label>
                        <Input
                          id="teamPrincipal"
                          placeholder="Ej: Frédéric Vasseur"
                          value={teamPrincipal}
                          onChange={(e) => setTeamPrincipal(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="teamDate">Fecha de Fundación</Label>
                        <Input
                          id="teamDate"
                          type="date"
                          value={teamDate}
                          onChange={(e) => setTeamDate(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateTeam} size="sm">Crear Escudería</Button>
                        <Button variant="outline" onClick={() => setShowTeamForm(false)} size="sm">Cancelar</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de escuderías */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {teams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay escuderías registradas</p>
                  ) : (
                    teams.map((team) => (
                      <div key={team.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{team.name}</p>
                          <p className="text-xs text-muted-foreground">{team.country} - {team.principal}</p>
                          {formatDate(team.date) && (
                            <p className="text-xs text-blue-600">Fundada: {formatDate(team.date)}</p>
                          )}
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteTeam(team.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Pilotos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Pilotos
                </CardTitle>
                <Button 
                  onClick={() => setShowDriverForm(!showDriverForm)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Piloto
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulario para crear piloto */}
                {showDriverForm && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-semibold mb-3">Nuevo Piloto</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="driverName">Nombre del Piloto</Label>
                        <Input
                          id="driverName"
                          placeholder="Ej: Max Verstappen"
                          value={driverName}
                          onChange={(e) => setDriverName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="driverTeam">Escudería</Label>
                        <select 
                          id="driverTeam"
                          value={driverTeam} 
                          onChange={(e) => setDriverTeam(e.target.value)}
                          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                        >
                          <option value="">Seleccionar escudería</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.name}>{team.name}</option>
                          ))}
                          {/* Escuderías por defecto */}
                          <option value="Red Bull Racing">Red Bull Racing</option>
                          <option value="Ferrari">Ferrari</option>
                          <option value="Mercedes">Mercedes</option>
                          <option value="McLaren">McLaren</option>
                          <option value="Aston Martin">Aston Martin</option>
                          <option value="Alpine">Alpine</option>
                          <option value="Williams">Williams</option>
                          <option value="Racing Bulls">Racing Bulls</option>
                          <option value="Haas">Haas</option>
                          <option value="Sauber">Sauber</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="driverNationality">Nacionalidad</Label>
                        <select 
                          id="driverNationality"
                          value={driverNationality} 
                          onChange={(e) => setDriverNationality(e.target.value)}
                          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                        >
                          <option value="">Seleccionar nacionalidad</option>
                          <option value="Dutch">Holandés</option>
                          <option value="British">Británico</option>
                          <option value="Spanish">Español</option>
                          <option value="Mexican">Mexicano</option>
                          <option value="Monégasque">Monégasco</option>
                          <option value="Australian">Australiano</option>
                          <option value="Canadian">Canadiense</option>
                          <option value="French">Francés</option>
                          <option value="Argentinian">Argentino</option>
                          <option value="Thai">Tailandés</option>
                          <option value="German">Alemán</option>
                          <option value="Finnish">Finlandés</option>
                          <option value="Danish">Danés</option>
                          <option value="Japanese">Japonés</option>
                          <option value="Chinese">Chino</option>
                          <option value="Brazilian">Brasileño</option>
                          <option value="Italian">Italiano</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="driverRole">Rol</Label>
                        <select
                          id="driverRole"
                          value={driverRoleInput}
                          onChange={(e) => setDriverRoleInput(e.target.value as any)}
                          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                        >
                          <option value="titular">Titular</option>
                          <option value="suplente">Suplente</option>
                          <option value="reserva">Reserva</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="driverNumber">Número</Label>
                        <Input
                          id="driverNumber"
                          type="number"
                          placeholder="Ej: 1"
                          value={driverNumber}
                          onChange={(e) => setDriverNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="driverImage">URL de la Imagen</Label>
                        <Input
                          id="driverImage"
                          placeholder="Ej: https://ejemplo.com/piloto.jpg o /piloto.jpg"
                          value={driverImage}
                          onChange={(e) => setDriverImage(e.target.value)}
                        />
                        {driverImage && (
                          <div className="mt-2">
                            <img 
                              src={driverImage} 
                              alt="Preview" 
                              className="w-16 h-16 object-cover rounded-full border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-user.jpg"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateDriver} size="sm">Crear Piloto</Button>
                        <Button variant="outline" onClick={() => setShowDriverForm(false)} size="sm">Cancelar</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de pilotos */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {drivers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay pilotos registrados</p>
                  ) : (
                    drivers.map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">#{driver.number} {driver.name}</p>
                          <p className="text-xs text-muted-foreground">{driver.team} - {driver.nationality}</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteDriver(driver.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resultados de Carreras */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Resultados de Carreras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Seleccionar carrera */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-3">Seleccionar Carrera</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="raceSelect">Carrera</Label>
                      <select 
                        id="raceSelect" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedRaceId} 
                        onChange={(e) => handleSelectRace(e.target.value)}
                      >
                        <option value="">Selecciona una carrera...</option>
                        {availableRaces.map((race) => (
                          <option key={race.id} value={race.id}>
                            {race.name} - {new Date(race.fullDate).toLocaleDateString('es-ES')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      {selectedRaceId && (
                        <Badge variant="secondary" className="h-10 px-3 flex items-center">
                          <Trophy className="h-4 w-4 mr-1" />
                          Carrera seleccionada
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Selecciona una carrera del calendario F1 2025 para cargar sus resultados. Los puntos se calculan automáticamente (25–18–15–12–10–8–6–4–2–1) solo para el Top 10.</p>
                </div>

                {/* Resultados de la carrera seleccionada */}
                <div className="space-y-4 max-h-[36rem] overflow-y-auto pr-1">
                  {!selectedRaceId ? (
                    <p className="text-sm text-muted-foreground">Selecciona una carrera para cargar sus resultados.</p>
                  ) : (
                    (() => {
                      const selectedRace = races.find(r => r.id === selectedRaceId)
                      if (!selectedRace) return null
                      
                      return (
                        <div key={selectedRace.id} className="border rounded-lg">
                          <div className="flex items-center justify-between p-3 border-b">
                            <div>
                              <p className="font-semibold text-sm">{selectedRace.name}</p>
                              {selectedRace.date && <p className="text-xs text-muted-foreground">{selectedRace.date}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="secondary" onClick={() => handleSaveRace(selectedRace.id)}>Guardar Resultados</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleClearRaceResults(selectedRace.id)}>
                                <Trash2 className="h-3 w-3 mr-1"/>
                                Limpiar Resultados
                              </Button>
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground mb-2">
                              <div className="col-span-1">Pos</div>
                              <div className="col-span-6">Piloto</div>
                              <div className="col-span-2">Número</div>
                              <div className="col-span-2">Escudería</div>
                              <div className="col-span-1 text-right">Pts</div>
                            </div>
                            <div className="space-y-2">
                              {Array.from({ length: 20 }, (_, i) => i + 1).map((pos) => {
                                const rr = selectedRace.results.find(r => r.position === pos) || { position: pos, driver: "", number: "", team: "" }
                                const selectedDriver = drivers.find(d => d.name === rr.driver)
                                return (
                                  <div key={pos} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-1 text-sm font-medium">{pos}</div>
                                    <div className="col-span-6">
                                      <select 
                                        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={selectedDriver?.id || ""}
                                        onChange={(e) => updateDriverSelection(selectedRace.id, pos, e.target.value)}
                                      >
                                        <option value="">Seleccionar piloto...</option>
                                        {drivers.map((driver) => (
                                          <option key={driver.id} value={driver.id}>
                                            {driver.name} ({driver.team})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="col-span-2">
                                      <div className="flex h-8 w-full rounded-md border border-input bg-muted px-2 py-1 text-sm text-muted-foreground">
                                        #{rr.number || "-"}
                                      </div>
                                    </div>
                                    <div className="col-span-2">
                                      <div className="flex h-8 w-full rounded-md border border-input bg-muted px-2 py-1 text-sm text-muted-foreground truncate">
                                        {rr.team || "-"}
                                      </div>
                                    </div>
                                    <div className="col-span-1 text-right text-sm font-semibold">{getPointsForPosition(pos)}</div>
                                  </div>
                                )
                              })}
                            </div>

                          </div>
                        </div>
                      )
                    })()
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Datos FIA */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Datos FIA
                </CardTitle>
                <Button 
                  onClick={() => setShowFiaForm(!showFiaForm)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Dato FIA
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulario para crear dato FIA */}
                {showFiaForm && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-semibold mb-3">Nuevo Dato FIA</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="fiaTitle">Título</Label>
                        <Input
                          id="fiaTitle"
                          placeholder="Ej: Reglamento Técnico 2024"
                          value={fiaTitle}
                          onChange={(e) => setFiaTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fiaCategory">Categoría</Label>
                        <select 
                          id="fiaCategory"
                          value={fiaCategory} 
                          onChange={(e) => setFiaCategory(e.target.value)}
                          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                        >
                          <option value="">Seleccionar categoría</option>
                          <option value="Técnico">Reglamento Técnico</option>
                          <option value="Deportivo">Reglamento Deportivo</option>
                          <option value="Decisión">Decisión de Comisarios</option>
                          <option value="Comunicado">Comunicado Oficial</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="fiaDescription">Descripción</Label>
                        <Input
                          id="fiaDescription"
                          placeholder="Descripción detallada"
                          value={fiaDescription}
                          onChange={(e) => setFiaDescription(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fiaDate">Fecha del Documento</Label>
                        <Input
                          id="fiaDate"
                          type="date"
                          value={fiaDate}
                          onChange={(e) => setFiaDate(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateFiaData} size="sm">Crear Dato FIA</Button>
                        <Button variant="outline" onClick={() => setShowFiaForm(false)} size="sm">Cancelar</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de datos FIA */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {fiaData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay datos FIA registrados</p>
                  ) : (
                    fiaData.map((fia) => (
                      <div key={fia.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{fia.title}</p>
                          <p className="text-xs text-muted-foreground">{fia.category} - {fia.description}</p>
                          {formatDate(fia.date) && (
                            <p className="text-xs text-green-600">Fecha: {formatDate(fia.date)}</p>
                          )}
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteFiaData(fia.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de resumen de información */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Resumen de Información
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{events.length}</div>
                  <p className="text-sm text-muted-foreground">Eventos</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{teams.length}</div>
                  <p className="text-sm text-muted-foreground">Escuderías</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{drivers.length}</div>
                  <p className="text-sm text-muted-foreground">Pilotos</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{fiaData.length}</div>
                  <p className="text-sm text-muted-foreground">Datos FIA</p>
                </div>
                <div className="p-4 border rounded-lg text-center md:col-span-4 lg:col-span-1">
                  <div className="text-2xl font-bold text-primary">{inspections.length}</div>
                  <p className="text-sm text-muted-foreground">Controles/Inspecciones</p>
                </div>
              </div>
              
              {(events.length > 0 || teams.length > 0 || drivers.length > 0 || fiaData.length > 0) && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ La información se está cargando y visualizando instantáneamente en la plataforma
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <FloatingChat />
    </div>
  )
}
