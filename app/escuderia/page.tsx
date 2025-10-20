"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Users, Plus, Edit, Trash2, Calendar, FileText } from "lucide-react"
import { getAllTeams, initializeDefaultTeams, type F1Team } from "@/lib/default-teams"
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
  
  // Form data
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<"noticia" | "anuncio" | "resultado" | "comunicado">("noticia")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    // Inicializar escuderías por defecto
    initializeDefaultTeams()
    
    // Cargar todas las escuderías (por defecto + manuales)
    const allTeams = getAllTeams()
    setTeams(allTeams)

    // Cargar publicaciones existentes
    const storedPosts = localStorage.getItem('f1_team_posts')
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    }
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

      {/* Formulario de Creación/Edición */}
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
      {!showCreateForm && selectedTeam && (
        <Button onClick={() => setShowCreateForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Crear Nueva Publicación
        </Button>
      )}

      {/* Lista de Publicaciones */}
      {selectedTeam && (
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