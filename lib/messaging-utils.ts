interface User {
  id: string
  name: string
  email: string
  user_role: "usuario" | "escuderia" | "administrador"
}

interface Message {
  id: string
  fromUserId: string
  toUserId: string
  message: string
  timestamp: number
  read: boolean
  type?: "reclamo" | "normal"
  reclamoId?: string
}

// Obtener todos los usuarios con rol "escuderia"
export function getAllTeamUsers(): User[] {
  try {
    const storedUsers = localStorage.getItem("f1_users")
    if (!storedUsers) return []

    const users: User[] = JSON.parse(storedUsers)
    return users.filter(user => user.user_role === "escuderia")
  } catch {
    return []
  }
}

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

// Obtener todos los administradores
export function getAllAdmins(): User[] {
  try {
    const storedUsers = localStorage.getItem("f1_users")
    if (!storedUsers) return []
    
    const users: User[] = JSON.parse(storedUsers)
    return users.filter(user => user.user_role === "administrador")
  } catch {
    return []
  }
}

// Obtener usuario por ID
export function getUserById(userId: string): User | null {
  try {
    const storedUsers = localStorage.getItem("f1_users")
    if (!storedUsers) return null
    
    const users: User[] = JSON.parse(storedUsers)
    return users.find(user => user.id === userId) || null
  } catch {
    return null
  }
}

// Enviar mensaje automático de nuevo reclamo a administradores
export function sendReclamoCreatedMessage(reclamo: FiaClaim, fromUser: User) {
  const admins = getAllAdmins()
  if (admins.length === 0) return

  const messageText = `🚨 NUEVO RECLAMO #${reclamo.id}

Escudería: ${reclamo.teamName}
Tipo: ${reclamo.type.replace(/_/g, " ")}
${reclamo.event ? `Evento: ${reclamo.event}` : ""}
${reclamo.driver ? `Piloto: ${reclamo.driver}` : ""}
${reclamo.reference ? `Referencia: ${reclamo.reference}` : ""}

Descripción: ${reclamo.description}

Estado: PENDIENTE
Fecha: ${new Date(reclamo.createdAt).toLocaleString("es-ES")}`

  // Enviar mensaje a todos los administradores
  admins.forEach(admin => {
    sendMessage(fromUser.id, admin.id, messageText, "reclamo", reclamo.id)
  })
}

// Enviar mensaje automático de cambio de estado de reclamo
export function sendReclamoStatusChangeMessage(reclamo: FiaClaim, newStatus: string, adminUser: User) {
  // Buscar al usuario que creó el reclamo usando userId
  const teamUser = getUserById(reclamo.userId)
  if (!teamUser) {
    console.error("Usuario no encontrado para reclamo:", reclamo.userId)
    return
  }

  console.log("Enviando mensaje de cambio de estado:", {
    reclamoId: reclamo.id,
    newStatus,
    fromAdmin: adminUser.name,
    toUser: teamUser.name
  })

  const statusMessages = {
    "en revision": "está siendo revisado",
    "aceptado": "ha sido ACEPTADO ✅",
    "rechazado": "ha sido RECHAZADO ❌"
  }

  const statusMessage = statusMessages[newStatus as keyof typeof statusMessages] || `cambió a ${newStatus}`

  const messageText = `📋 ACTUALIZACIÓN DE RECLAMO #${reclamo.id}

Su reclamo ${statusMessage}

Escudería: ${reclamo.teamName}
Tipo: ${reclamo.type.replace(/_/g, " ")}
${reclamo.event ? `Evento: ${reclamo.event}` : ""}
${reclamo.driver ? `Piloto: ${reclamo.driver}` : ""}

Descripción: ${reclamo.description}

Nuevo Estado: ${newStatus.toUpperCase()}
Actualizado por: ${adminUser.name}
Fecha: ${new Date().toLocaleString("es-ES")}`

  sendMessage(adminUser.id, teamUser.id, messageText, "reclamo", reclamo.id)
}

// Función base para enviar mensaje
function sendMessage(fromUserId: string, toUserId: string, messageText: string, type: "reclamo" | "normal" = "normal", reclamoId?: string) {
  try {
    console.log("Enviando mensaje:", {
      from: fromUserId,
      to: toUserId,
      type,
      reclamoId,
      preview: messageText.substring(0, 50) + "..."
    })

    const storedMessages = localStorage.getItem("f1_messages")
    const messages: Message[] = storedMessages ? JSON.parse(storedMessages) : []

    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      fromUserId,
      toUserId,
      message: messageText,
      timestamp: Date.now(),
      read: false,
      type,
      reclamoId
    }

    const updatedMessages = [...messages, newMessage]
    localStorage.setItem("f1_messages", JSON.stringify(updatedMessages))

    console.log("Mensaje guardado exitosamente")

    // Disparar evento para notificar al chat
    window.dispatchEvent(new CustomEvent("f1-new-message", { detail: newMessage }))
  } catch (error) {
    console.error("Error sending message:", error)
  }
}

// Notificaciones relacionadas a controles/inspecciones técnicas y de neumáticos
// inspection es de tipo any para evitar dependencias cruzadas; debe incluir al menos:
// { id, type, teamName, eventName, scheduledAt, performedAt?, status, resultsSummary?, parameters? }
export function sendInspectionScheduledMessage(inspection: any, adminUser: User, toUserId: string) {
  const title = inspection.type === "neumaticos" ? "Control de Neumáticos" : "Prueba Técnica"
  const messageText = `🛠️ ${title} PROGRAMADO

Escudería: ${inspection.teamName}
Evento: ${inspection.eventName || "-"}
Fecha programada: ${inspection.scheduledAt ? new Date(inspection.scheduledAt).toLocaleString("es-ES") : "-"}
Inspector: ${inspection.inspector || "FIA"}
Estado: PROGRAMADO`

  sendMessage(adminUser.id, toUserId, messageText, "normal")
}

export function sendInspectionProgressMessage(inspection: any, adminUser: User, toUserId: string) {
  const title = inspection.type === "neumaticos" ? "Control de Neumáticos" : "Prueba Técnica"
  const messageText = `⏱️ ${title} EN PROGRESO

Escudería: ${inspection.teamName}
Evento: ${inspection.eventName || "-"}
Iniciado por: ${inspection.inspector || "FIA"}
Estado: EN PROGRESO`

  sendMessage(adminUser.id, toUserId, messageText, "normal")
}

export function sendInspectionResultMessage(inspection: any, adminUser: User, toUserId: string) {
  const title = inspection.type === "neumaticos" ? "Control de Neumáticos" : "Prueba Técnica"
  const statusLabel = (inspection.status || "").toString().toUpperCase()
  const when = inspection.performedAt ? new Date(inspection.performedAt).toLocaleString("es-ES") : new Date().toLocaleString("es-ES")
  const summary = inspection.resultsSummary ? `\n\nResumen:\n${inspection.resultsSummary}` : ""
  const messageText = `📑 RESULTADO ${title}

Escudería: ${inspection.teamName}
Evento: ${inspection.eventName || "-"}
Fecha: ${when}
Estado: ${statusLabel}${summary}`

  sendMessage(adminUser.id, toUserId, messageText, "normal")
}

// Obtener mensajes no leídos para un usuario
export function getUnreadMessagesCount(userId: string): number {
  try {
    const storedMessages = localStorage.getItem("f1_messages")
    if (!storedMessages) return 0
    
    const messages: Message[] = JSON.parse(storedMessages)
    return messages.filter(msg => msg.toUserId === userId && !msg.read).length
  } catch {
    return 0
  }
}

// Marcar mensajes como leídos
export function markMessagesAsRead(userId: string, fromUserId?: string) {
  try {
    const storedMessages = localStorage.getItem("f1_messages")
    if (!storedMessages) return
    
    const messages: Message[] = JSON.parse(storedMessages)
    const updatedMessages = messages.map(msg => {
      if (msg.toUserId === userId && (!fromUserId || msg.fromUserId === fromUserId)) {
        return { ...msg, read: true }
      }
      return msg
    })
    
    localStorage.setItem("f1_messages", JSON.stringify(updatedMessages))
    
    // Disparar evento para actualizar UI
    window.dispatchEvent(new Event("f1-messages-updated"))
  } catch (error) {
    console.error("Error marking messages as read:", error)
  }
}