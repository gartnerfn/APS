"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Users, Plus, Edit, Trash2, Calendar, FileText, UserCheck, Trophy, Settings } from "lucide-react"
import { getAllTeams, initializeDefaultTeams, type F1Team } from "@/lib/default-teams"
import { getAllDrivers, getDriversByTeam, updateDriverInfo, initializeDefaultDrivers, type F1Driver } from "@/lib/default-drivers"
import { FloatingChat } from "@/components/floating-chat"

interface TeamPost {
  id: string
  teamId: string
  teamName: string
  title: string
  content: string
  imageUrl?: string
  author: string
  authorEmail: string
  created: string
  category: "noticia" | "anuncio" | "resultado" | "comunicado"
}



export default function EscuderiaPanel() {
  const { user, isTeam } = useAuth()
  const router = useRouter()
  const [selectedTeam, setSelectedTeam] = useState<string>("")
  const [teams, setTeams] = useState<F1Team[]>([])
  const [posts, setPosts] = useState<TeamPost[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPost, setEditingPost] = useState<TeamPost | null>(null)
  
  // Driver management states
  const [drivers, setDrivers] = useState<F1Driver[]>([])
  const [editingDriver, setEditingDriver] = useState<F1Driver | null>(null)
  const [showDriverForm, setShowDriverForm] = useState(false)
  
  // Driver form data
  const [driverPoints, setDriverPoints] = useState("")
  const [driverStatus, setDriverStatus] = useState<"titular" | "suplente" | "reserva">("titular")
  const [driverSalary, setDriverSalary] = useState("")
  const [driverRole, setDriverRole] = useState("")
  const [driverBiography, setDriverBiography] = useState("")
  const [driverAchievements, setDriverAchievements] = useState("")
  const [driverInstagram, setDriverInstagram] = useState("")
  const [driverTwitter, setDriverTwitter] = useState("")
  
  // Post form data
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<"noticia" | "anuncio" | "resultado" | "comunicado">("noticia")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    // Inicializar equipos por defecto
    initializeDefaultTeams()
    
    // Inicializar pilotos por defecto
    initializeDefaultDrivers()
    
    // Cargar todas las escuderías (por defecto + manuales)
    const allTeams = getAllTeams()
    setTeams(allTeams)

    // Cargar todos los pilotos
    const allDrivers = getAllDrivers()
    setDrivers(allDrivers)

    // Cargar publicaciones existentes
    const storedPosts = localStorage.getItem('f1_team_posts')
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    }

    // Listener para actualizaciones de pilotos
    const handleDriversUpdate = () => {
      const updatedDrivers = getAllDrivers()
      setDrivers(updatedDrivers)
    }

    window.addEventListener('f1-drivers-updated', handleDriversUpdate)
    return () => window.removeEventListener('f1-drivers-updated', handleDriversUpdate)
  }, [])

  const handleCreatePost = () => {
    if (!selectedTeam || !title.trim() || !content.trim()) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    const selectedTeamData = teams.find(team => team.id === selectedTeam)
    if (!selectedTeamData) return

    const newPost: TeamPost = {
      id: Date.now().toString(),
      teamId: selectedTeam,
      teamName: selectedTeamData.name,
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      author: user!.name,
      authorEmail: user!.email,
      created: new Date().toISOString(),
      category
    }

    const updatedPosts = [...posts, newPost]
    setPosts(updatedPosts)
    localStorage.setItem('f1_team_posts', JSON.stringify(updatedPosts))

    // Limpiar formulario
    setTitle("")
    setContent("")
    setImageUrl("")
    setCategory("noticia")
    setShowCreateForm(false)
    
    alert("Publicación creada exitosamente")
  }

  const handleEditPost = (post: TeamPost) => {
    setEditingPost(post)
    setTitle(post.title)
    setContent(post.content)
    setImageUrl(post.imageUrl || "")
    setCategory(post.category)
    setSelectedTeam(post.teamId)
    setShowCreateForm(true)
  }

  const handleUpdatePost = () => {
    if (!editingPost || !selectedTeam || !title.trim() || !content.trim()) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    const selectedTeamData = teams.find(team => team.id === selectedTeam)
    if (!selectedTeamData) return

    const updatedPost: TeamPost = {
      ...editingPost,
      teamId: selectedTeam,
      teamName: selectedTeamData.name,
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      category
    }

    const updatedPosts = posts.map(post => 
      post.id === editingPost.id ? updatedPost : post
    )
    
    setPosts(updatedPosts)
    localStorage.setItem('f1_team_posts', JSON.stringify(updatedPosts))

    // Limpiar formulario
    setTitle("")
    setContent("")
    setImageUrl("")
    setCategory("noticia")
    setShowCreateForm(false)
    setEditingPost(null)
    
    alert("Publicación actualizada exitosamente")
  }

  const handleDeletePost = (postId: string) => {
    if (confirm("¿Está seguro que desea eliminar esta publicación?")) {
      const updatedPosts = posts.filter(post => post.id !== postId)
      setPosts(updatedPosts)
      localStorage.setItem('f1_team_posts', JSON.stringify(updatedPosts))
      alert("Publicación eliminada exitosamente")
    }
  }

  const cancelEdit = () => {
    setEditingPost(null)
    setShowCreateForm(false)
    setTitle("")
    setContent("")
    setImageUrl("")
    setCategory("noticia")
    setSelectedTeam("")
  }

  // Driver management functions
  const handleEditDriver = (driver: F1Driver) => {
    setEditingDriver(driver)
    setDriverPoints(driver.points.toString())
    setDriverStatus(driver.status)
    setDriverSalary(driver.salary || "")
    setDriverRole(driver.role || "")
    setDriverBiography(driver.biography || "")
    setDriverAchievements(driver.achievements?.join(", ") || "")
    setDriverInstagram(driver.socialMedia?.instagram || "")
    setDriverTwitter(driver.socialMedia?.twitter || "")
    setShowDriverForm(true)
  }

  const handleUpdateDriver = () => {
    if (!editingDriver) return

    const updates: Partial<F1Driver> = {
      points: parseInt(driverPoints) || 0,
      status: driverStatus,
      salary: driverSalary.trim() || undefined,
      role: driverRole.trim() || undefined,
      biography: driverBiography.trim() || undefined,
      achievements: driverAchievements.trim() ? driverAchievements.split(",").map(a => a.trim()) : undefined,
      socialMedia: {
        instagram: driverInstagram.trim() || undefined,
        twitter: driverTwitter.trim() || undefined
      }
    }

    updateDriverInfo(editingDriver.id, updates)
    
    // Limpiar formulario
    cancelDriverEdit()
    alert("Información del piloto actualizada exitosamente")
  }

  const cancelDriverEdit = () => {
    setEditingDriver(null)
    setShowDriverForm(false)
    setDriverPoints("")
    setDriverStatus("titular")
    setDriverSalary("")
    setDriverRole("")
    setDriverBiography("")
    setDriverAchievements("")
    setDriverInstagram("")
    setDriverTwitter("")
  }

  const getTeamDrivers = () => {
    if (!selectedTeam) return []
    const teamDrivers = getDriversByTeam(selectedTeam)
    console.log("Selected team ID:", selectedTeam)
    console.log("Team drivers found:", teamDrivers)
    return teamDrivers
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'titular':
        return 'bg-green-100 text-green-800'
      case 'suplente':
        return 'bg-yellow-100 text-yellow-800'
      case 'reserva':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'noticia':
        return 'bg-blue-100 text-blue-800'
      case 'anuncio':
        return 'bg-green-100 text-green-800'
      case 'resultado':
        return 'bg-purple-100 text-purple-800'
      case 'comunicado':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p>Debe iniciar sesión para acceder al panel de escudería</p>
          <Button onClick={() => router.push("/login")}>
            Iniciar Sesión
          </Button>
        </div>
      </div>
    )
  }

  if (!isTeam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p>Acceso no autorizado</p>
          <p className="text-sm text-muted-foreground">
            Su rol actual: {user.user_role} - Necesita rol: "escuderia"
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-4xl font-bold">Panel de Escudería</h1>
          <p className="text-muted-foreground">Bienvenido, {user.name}</p>
        </div>
      </div>

      {/* Selector de Escudería */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Escudería</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la escudería que representa" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name} - {team.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Contenido principal con pestañas */}
      {selectedTeam && (
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Publicaciones
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Pilotos
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Publicaciones */}
          <TabsContent value="posts" className="space-y-4">
            {/* Formulario de Creación/Edición de Posts */}
            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingPost ? "Editar Publicación" : "Crear Nueva Publicación"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título de la publicación"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="noticia">Noticia</SelectItem>
                        <SelectItem value="anuncio">Anuncio</SelectItem>
                        <SelectItem value="resultado">Resultado</SelectItem>
                        <SelectItem value="comunicado">Comunicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="content">Contenido *</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Contenido de la publicación"
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">URL de Imagen (opcional)</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={editingPost ? handleUpdatePost : handleCreatePost}>
                      {editingPost ? "Actualizar" : "Publicar"}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botón para crear nueva publicación */}
            {!showCreateForm && (
              <Button onClick={() => setShowCreateForm(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Crear Nueva Publicación
              </Button>
            )}

            {/* Lista de Publicaciones */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Mis Publicaciones</h2>
              {posts
                .filter(post => post.teamId === selectedTeam && post.authorEmail === user.email)
                .map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(post.category)}>
                              {post.category.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(post.created)}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold">{post.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{post.content}</p>
                      
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full max-h-64 object-cover rounded-lg"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              
              {posts.filter(post => post.teamId === selectedTeam && post.authorEmail === user.email).length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No hay publicaciones aún. ¡Crea tu primera publicación!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Pestaña de Pilotos */}
          <TabsContent value="drivers" className="space-y-4">
            {/* Formulario de Edición de Piloto */}
            {showDriverForm && editingDriver && (
              <Card>
                <CardHeader>
                  <CardTitle>Editar Información de Piloto</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Editando: {editingDriver.name} #{editingDriver.number}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="driverPoints">Puntos</Label>
                      <Input
                        id="driverPoints"
                        type="number"
                        value={driverPoints}
                        onChange={(e) => setDriverPoints(e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="driverStatus">Estado</Label>
                      <Select value={driverStatus} onValueChange={(value: any) => setDriverStatus(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="titular">Titular</SelectItem>
                          <SelectItem value="suplente">Suplente</SelectItem>
                          <SelectItem value="reserva">Reserva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="driverSalary">Salario</Label>
                      <Input
                        id="driverSalary"
                        value={driverSalary}
                        onChange={(e) => setDriverSalary(e.target.value)}
                        placeholder="$15M USD"
                      />
                    </div>

                    <div>
                      <Label htmlFor="driverRole">Rol Especial</Label>
                      <Input
                        id="driverRole"
                        value={driverRole}
                        onChange={(e) => setDriverRole(e.target.value)}
                        placeholder="Capitán del equipo"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="driverBiography">Biografía</Label>
                    <Textarea
                      id="driverBiography"
                      value={driverBiography}
                      onChange={(e) => setDriverBiography(e.target.value)}
                      placeholder="Información sobre el piloto..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="driverAchievements">Logros (separados por comas)</Label>
                    <Textarea
                      id="driverAchievements"
                      value={driverAchievements}
                      onChange={(e) => setDriverAchievements(e.target.value)}
                      placeholder="Campeón Mundial 2021, 3x Ganador del GP de Mónaco, etc."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="driverInstagram">Instagram</Label>
                      <Input
                        id="driverInstagram"
                        value={driverInstagram}
                        onChange={(e) => setDriverInstagram(e.target.value)}
                        placeholder="@username"
                      />
                    </div>

                    <div>
                      <Label htmlFor="driverTwitter">Twitter/X</Label>
                      <Input
                        id="driverTwitter"
                        value={driverTwitter}
                        onChange={(e) => setDriverTwitter(e.target.value)}
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleUpdateDriver}>
                      <Settings className="h-4 w-4 mr-2" />
                      Actualizar Información
                    </Button>
                    <Button variant="outline" onClick={cancelDriverEdit}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Pilotos del Equipo */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Pilotos del Equipo</h2>
              
              {getTeamDrivers().map((driver) => (
                <Card key={driver.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={driver.image} alt={driver.name} />
                        <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{driver.name}</h3>
                            <p className="text-muted-foreground">
                              #{driver.number} • {driver.nationality} {driver.country}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(driver.status)}>
                              {driver.status.toUpperCase()}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDriver(driver)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">Puntos</p>
                            <p className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              {driver.points}
                            </p>
                          </div>
                          
                          {driver.salary && (
                            <div>
                              <p className="font-medium text-muted-foreground">Salario</p>
                              <p>{driver.salary}</p>
                            </div>
                          )}
                          
                          {driver.role && (
                            <div>
                              <p className="font-medium text-muted-foreground">Rol</p>
                              <p>{driver.role}</p>
                            </div>
                          )}
                          
                          {driver.contract && (
                            <div>
                              <p className="font-medium text-muted-foreground">Contrato</p>
                              <p>{driver.contract.startYear}-{driver.contract.endYear}</p>
                            </div>
                          )}
                        </div>
                        
                        {driver.biography && (
                          <div>
                            <p className="font-medium text-muted-foreground">Biografía</p>
                            <p className="text-sm">{driver.biography}</p>
                          </div>
                        )}
                        
                        {driver.achievements && driver.achievements.length > 0 && (
                          <div>
                            <p className="font-medium text-muted-foreground">Logros</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {driver.achievements.map((achievement, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {achievement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {(driver.socialMedia?.instagram || driver.socialMedia?.twitter) && (
                          <div>
                            <p className="font-medium text-muted-foreground">Redes Sociales</p>
                            <div className="flex gap-2 text-sm">
                              {driver.socialMedia.instagram && (
                                <span>Instagram: {driver.socialMedia.instagram}</span>
                              )}
                              {driver.socialMedia.twitter && (
                                <span>Twitter: {driver.socialMedia.twitter}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {getTeamDrivers().length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No hay pilotos asignados a este equipo.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {teams.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No hay escuderías disponibles. Contacte al administrador para que agregue escuderías al sistema.
            </p>
          </CardContent>
        </Card>
      )}
      <FloatingChat />
    </div>
  )
}