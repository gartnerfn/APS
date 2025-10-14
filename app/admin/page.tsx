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
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Trash2, Edit3, Plus, UserPlus, Upload, FileText, Users, Trophy, Database } from "lucide-react"

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

  // Estados para formularios de pilotos
  const [driverName, setDriverName] = useState("")
  const [driverTeam, setDriverTeam] = useState("")
  const [driverNationality, setDriverNationality] = useState("")
  const [driverNumber, setDriverNumber] = useState("")
  const [driverImage, setDriverImage] = useState("")

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
    if (!user) {
      router.push("/login")
      return
    }

    if (user.user_role !== "administrador") {
      router.push("/")
      return
    }

    setUsers(getAllUsers())
    
    // Cargar datos manuales desde localStorage
    const storedEvents = localStorage.getItem('f1_events_manual')
    const storedTeams = localStorage.getItem('f1_teams_manual')
    const storedDrivers = localStorage.getItem('f1_drivers_manual')
    const storedFiaData = localStorage.getItem('f1_fia_manual')
    
    if (storedEvents) setEvents(JSON.parse(storedEvents))
    if (storedTeams) setTeams(JSON.parse(storedTeams))
    if (storedDrivers) setDrivers(JSON.parse(storedDrivers))
    if (storedFiaData) setFiaData(JSON.parse(storedFiaData))
    
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
      created: new Date().toLocaleString()
    }

    const updatedTeams = [...teams, newTeam]
    setTeams(updatedTeams)
    localStorage.setItem('f1_teams_manual', JSON.stringify(updatedTeams))
    
    // Limpiar formulario
    setTeamName("")
    setTeamCountry("")
    setTeamPrincipal("")
    setTeamDate("")
    setShowTeamForm(false)
    
    alert("Escudería creada exitosamente")
  }

  // Funciones para manejo de pilotos
  const handleCreateDriver = () => {
    if (!driverName.trim() || !driverTeam.trim() || !driverNationality.trim() || !driverNumber.trim()) {
      alert("Por favor completa todos los campos del piloto")
      return
    }

    const newDriver = {
      id: Date.now().toString(),
      name: driverName.trim(),
      team: driverTeam.trim(),
      nationality: driverNationality.trim(),
      number: parseInt(driverNumber),
      image: driverImage || "/placeholder-user.jpg",
      created: new Date().toLocaleString()
    }

    const updatedDrivers = [...drivers, newDriver]
    setDrivers(updatedDrivers)
    localStorage.setItem('f1_drivers_manual', JSON.stringify(updatedDrivers))
    
    // Limpiar formulario
    setDriverName("")
    setDriverTeam("")
    setDriverNationality("")
    setDriverNumber("")
    setDriverImage("")
    setShowDriverForm(false)
    
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
  }

  const handleDeleteTeam = (id: string) => {
    if (!confirm("¿Eliminar esta escudería?")) return
    const updatedTeams = teams.filter(t => t.id !== id)
    setTeams(updatedTeams)
    localStorage.setItem('f1_teams_manual', JSON.stringify(updatedTeams))
  }

  const handleDeleteDriver = (id: string) => {
    if (!confirm("¿Eliminar este piloto?")) return
    const updatedDrivers = drivers.filter(d => d.id !== id)
    setDrivers(updatedDrivers)
    localStorage.setItem('f1_drivers_manual', JSON.stringify(updatedDrivers))
  }

  const handleDeleteFiaData = (id: string) => {
    if (!confirm("¿Eliminar este dato FIA?")) return
    const updatedFiaData = fiaData.filter(f => f.id !== id)
    setFiaData(updatedFiaData)
    localStorage.setItem('f1_fia_manual', JSON.stringify(updatedFiaData))
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
    const now = new Date().toISOString()
    const updated = all.map(c => (c.id === id ? { ...c, status, updatedAt: now } : c))
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(updated))
    setClaims(updated.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)))
    try { window.dispatchEvent(new Event("f1-fia-claims-updated")) } catch {}
  }

  const pendingCount = claims.filter(c => c.status === "pendiente").length

  if (!user) return null

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
    </div>
  )
}
