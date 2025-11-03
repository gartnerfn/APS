"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"

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

export function TeamPostsSection() {
  const [posts, setPosts] = useState<TeamPost[]>([])

  useEffect(() => {
    // Cargar publicaciones desde localStorage
    const storedPosts = localStorage.getItem('f1_team_posts')
    if (storedPosts) {
      const allPosts = JSON.parse(storedPosts)
      // Ordenar por fecha más reciente primero
      const sortedPosts = allPosts.sort((a: TeamPost, b: TeamPost) => 
        new Date(b.created).getTime() - new Date(a.created).getTime()
      )
      setPosts(sortedPosts)
    }
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'noticia':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'anuncio':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'resultado':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'comunicado':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'noticia':
        return '📰'
      case 'anuncio':
        return '📢'
      case 'resultado':
        return '🏆'
      case 'comunicado':
        return '📋'
      default:
        return '📄'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (posts.length === 0) {
    return null // No mostrar la sección si no hay publicaciones
  }

  return (
    <section id="noticias-escuderias" className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-10 w-10 text-primary" />
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">NOTICIAS DE ESCUDERÍAS</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 9).map((post) => ( // Mostrar máximo 9 publicaciones
          <Card key={post.id} className="bg-card border-border hover:border-primary transition-colors overflow-hidden group">
            <CardContent className="p-0">
              {/* Imagen de la publicación */}
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6 space-y-4">
                {/* Header con categoría y fecha */}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${getCategoryColor(post.category)}`}
                  >
                    <span>{getCategoryIcon(post.category)}</span>
                    {post.category.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.created)}</span>
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {/* Contenido truncado */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {truncateContent(post.content)}
                </p>

                {/* Footer con escudería y autor */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-primary">
                        🏎️ {post.teamName}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mostrar más publicaciones si hay más de 9 */}
      {posts.length > 9 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Mostrando las 9 publicaciones más recientes de {posts.length} total
          </p>
        </div>
      )}
    </section>
  )
}