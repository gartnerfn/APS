"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getAllTeams, initializeDefaultTeams, type F1Team } from "@/lib/default-teams"
import { sendReclamoCreatedMessage } from "@/lib/messaging-utils"
import { FloatingChat } from "@/components/floating-chat"

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
  status: "pendiente" | "en revision" | "aceptado" | "rechazado"
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "f1_fia_claims"

export default function ReclamosPage() {
  const { user, isTeam, loading } = useAuth()
  const router = useRouter()
  const [claims, setClaims] = useState<FiaClaim[]>([])
  const [teams, setTeams] = useState<F1Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>("")

  // Form state
  const [type, setType] = useState("sancion_incorrecta")
  const [reference, setReference] = useState("")
  const [eventName, setEventName] = useState("")
  const [driver, setDriver] = useState("")
  const [description, setDescription] = useState("")
  const [evidence, setEvidence] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }
    if (!isTeam) {
      router.push("/")
      return
    }

    // Inicializar escuderías por defecto
    initializeDefaultTeams()
    
    // Cargar todas las escuderías
    const allTeams = getAllTeams()
    setTeams(allTeams)

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setClaims(parsed) // Cargar todos los reclamos, no filtrar por usuario
        }
      } catch {}
    }
    const handler = () => {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s) {
        try {
          const p = JSON.parse(s)
          setClaims(p) // Cargar todos los reclamos, el filtrado se hace en el render
        } catch {}
      }
    }
    window.addEventListener("f1-fia-claims-updated", handler)
    return () => window.removeEventListener("f1-fia-claims-updated", handler)
  }, [user, isTeam, loading, router])

  if (loading) return null

  const resetForm = () => {
    setType("sancion_incorrecta")
    setReference("")
    setEventName("")
    setDriver("")
    setDescription("")
    setEvidence("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) {
      toast({ title: "Escudería requerida", description: "Selecciona la escudería que representas" })
      return
    }
    if (!description.trim()) {
      toast({ title: "Descripción requerida", description: "Agrega una descripción del reclamo" })
      return
    }

    const selectedTeamData = teams.find(team => team.id === selectedTeam)
    if (!selectedTeamData) {
      toast({ title: "Error", description: "Escudería no encontrada" })
      return
    }

    setSubmitting(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const all: FiaClaim[] = stored ? JSON.parse(stored) : []
      const now = new Date().toISOString()
      const newClaim: FiaClaim = {
        id: Date.now().toString(),
        teamId: selectedTeam,
        teamName: selectedTeamData.name,
        userId: user!.id,
        type,
        reference: reference.trim() || undefined,
        event: eventName.trim() || undefined,
        driver: driver.trim() || undefined,
        description: description.trim(),
        evidence: evidence.trim() || undefined,
        status: "pendiente",
        createdAt: now,
        updatedAt: now,
      }
      const updated = [newClaim, ...all]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setClaims(updated) // Actualizar con todos los reclamos
      
      // Enviar mensaje automático a administradores
      if (user) {
        sendReclamoCreatedMessage(newClaim, user)
      }
      
      resetForm()
      // No limpiar selectedTeam para que el usuario pueda ver su reclamo enviado
      toast({ title: "Reclamo enviado", description: "Se notificó a la FIA para su revisión." })
      try { window.dispatchEvent(new Event("f1-fia-claims-updated")) } catch {}
    } catch (err) {
      toast({ title: "Error", description: "No se pudo guardar el reclamo" })
    } finally {
      setSubmitting(false)
    }
  }

  const statusColor = (s: FiaClaim["status"]) => {
    switch (s) {
      case "pendiente": return "bg-yellow-200 text-yellow-800"
      case "en revision": return "bg-blue-200 text-blue-800"
      case "aceptado": return "bg-green-200 text-green-800"
      case "rechazado": return "bg-red-200 text-red-800"
      default: return "bg-muted"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-10">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold">Reclamos a la FIA</h1>
          <p className="text-sm text-muted-foreground">Usa este formulario para notificar a la FIA sobre sanciones incorrectas o datos erróneos detectados. Toda la información se almacena localmente (demo).</p>
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Reclamo</CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay escuderías disponibles.</p>
                  <p className="text-sm text-muted-foreground">Contacte al administrador para que agregue escuderías al sistema.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Selector de Escudería */}
                  <div>
                    <Label htmlFor="team">Escudería que representas *</Label>
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la escudería que representas" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name} - {team.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <select id="type" value={type} onChange={e => setType(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                      <option value="sancion_incorrecta">Sanción incorrecta</option>
                      <option value="dato_incorrecto">Dato incorrecto</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="reference">Referencia (ID sanción / dato)</Label>
                    <Input id="reference" value={reference} onChange={e => setReference(e.target.value)} placeholder="Ej: PEN-2025-07" />
                  </div>
                  <div>
                    <Label htmlFor="event">Evento / Carrera</Label>
                    <Input id="event" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Ej: Bahrain GP" />
                  </div>
                  <div>
                    <Label htmlFor="driver">Piloto afectado</Label>
                    <Input id="driver" value={driver} onChange={e => setDriver(e.target.value)} placeholder="Opcional" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe claramente el motivo del reclamo" rows={4} />
                </div>
                <div>
                  <Label htmlFor="evidence">Evidencia (URL o texto)</Label>
                  <Textarea id="evidence" value={evidence} onChange={e => setEvidence(e.target.value)} placeholder="Links, notas, etc." rows={3} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>{submitting ? "Enviando..." : "Enviar Reclamo"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>Limpiar</Button>
                </div>
                </form>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {selectedTeam 
              ? `Reclamos de ${teams.find(t => t.id === selectedTeam)?.name}` 
              : "Selecciona una escudería para ver sus reclamos"
            }
          </h2>
          {!selectedTeam ? (
            <p className="text-sm text-muted-foreground">Selecciona una escudería arriba para ver y gestionar sus reclamos.</p>
          ) : claims.filter(c => c.teamId === selectedTeam).length === 0 ? (
            <p className="text-sm text-muted-foreground">Esta escudería aún no ha presentado reclamos.</p>
          ) : (
            <div className="space-y-3">
              {claims.filter(c => c.teamId === selectedTeam).map(claim => (
                <Card key={claim.id} className="border">
                  <CardContent className="py-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="text-xs">#{claim.id}</Badge>
                      <Badge className="text-xs bg-blue-100 text-blue-800">{claim.teamName}</Badge>
                      <Badge className={"text-xs " + statusColor(claim.status)}>{claim.status}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(claim.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-sm font-medium">Tipo: {claim.type.replace(/_/g, " ")}</div>
                    {claim.reference && <div className="text-xs text-muted-foreground">Referencia: {claim.reference}</div>}
                    <div className="text-sm whitespace-pre-wrap">{claim.description}</div>
                    <div className="grid md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      {claim.event && <div>Evento: {claim.event}</div>}
                      {claim.driver && <div>Piloto: {claim.driver}</div>}
                      {claim.evidence && <div className="truncate" title={claim.evidence}>Evidencia: {claim.evidence}</div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <FloatingChat />
    </div>
  )
}
