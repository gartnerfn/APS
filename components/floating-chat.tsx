"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedRecipient, setSelectedRecipient] = useState<string>("")
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [availableRecipients, setAvailableRecipients] = useState<User[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Cargar usuario actual y mensajes
  useEffect(() => {
    const storedUser = localStorage.getItem("f1_user")

    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)
      loadRecipients(user)
    }

    loadMessages()
  }, [])

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, selectedRecipient])

  const loadRecipients = (user: User) => {
    const storedUsers = localStorage.getItem("f1_users")
    if (!storedUsers) return

    const allUsers: User[] = JSON.parse(storedUsers)

    // Si es usuario, mostrar solo escuderías
    // Si es escudería, mostrar todos los usuarios que no sean escuderías
    let recipients: User[] = []

    if (user.user_role !== "usuario")
      recipients = allUsers.filter((u) => u.user_role !== "usuario" && u.id !== user.id)

    setAvailableRecipients(recipients)

    if (recipients.length > 0 && !selectedRecipient) {
      setSelectedRecipient(recipients[0].id)
    }
  }

  const loadMessages = () => {
    const storedMessages = localStorage.getItem("f1_messages")
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    }
  }

  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem("f1_messages", JSON.stringify(newMessages))
    setMessages(newMessages)
  }

  const sendMessage = () => {
    if (!messageText.trim() || !currentUser || !selectedRecipient) return

    const newMessage: Message = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId: selectedRecipient,
      message: messageText.trim(),
      timestamp: Date.now(),
      read: false,
    }

    const updatedMessages = [...messages, newMessage]
    saveMessages(updatedMessages)
    setMessageText("")
  }

  const getConversationMessages = () => {
    if (!currentUser || !selectedRecipient) return []

    return messages
      .filter(
        (msg) =>
          (msg.fromUserId === currentUser.id && msg.toUserId === selectedRecipient) ||
          (msg.fromUserId === selectedRecipient && msg.toUserId === currentUser.id),
      )
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  const getRecipientName = (userId: string) => {
    const recipient = availableRecipients.find((u) => u.id === userId)
    return recipient?.name || "Usuario"
  }

  const getUnreadCount = () => {
    if (!currentUser) return 0
    return messages.filter((msg) => msg.toUserId === currentUser.id && !msg.read).length
  }

  const setMessagesRead = () => {
    if (!currentUser) return
    const updatedMessages = messages.map((msg) =>
      msg.toUserId === currentUser.id ? { ...msg, read: true } : msg,
    )
    saveMessages(updatedMessages)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  if (!currentUser) {
    return null
  }

  return (
    <>
      <button
        onClick={() => { 
          setIsOpen(!isOpen)
          setMessagesRead() 
        }}
        className={`fixed bottom-6 right-6 z-500 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white transition-all shadow-lg hover:bg-red-700 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 ${isOpen ? "hidden" : ""}`}
        aria-label="Abrir chat"
      >
        <>
          <MessageCircle className="h-6 w-6" />
          {getUnreadCount() > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
              {getUnreadCount()}
            </span>
          )}
        </>

      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col rounded-lg border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-red-600 p-4 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Chat F1</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Selector de destinatario */}
          {availableRecipients.length > 0 ? (
            <>
              <div className="border-b p-3">
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar destinatario" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRecipients.map((recipient) => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        {recipient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mensajes */}
              <ScrollArea className="flex-1 p-4 mb-17 bg-transparent overflow-hidden scroll-auto" ref={scrollRef}>
                <div className="space-y-3">
                  {getConversationMessages().length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                      No hay mensajes. ¡Envía el primero!
                    </div>
                  ) : (
                    getConversationMessages().map((msg) => {
                      const isFromMe = msg.fromUserId === currentUser.id
                      return (
                        <div key={msg.id} className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] rounded-lg px-3 py-2 ${isFromMe ? "bg-red-600 text-white" : "bg-muted text-foreground"
                              }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                            <span className={`text-xs ${isFromMe ? "text-red-100" : "text-muted-foreground"}`}>
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>

              {/* Input de mensaje */}
              <div className="absolute bottom-0 rounded-md left-0 w-full bg-white border-t p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!messageText.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-4 text-center text-sm text-muted-foreground">
              No hay {currentUser.user_role === "escuderia" ? "administradores" : "escuderias"} disponibles para chatear.
            </div>
          )}
        </div>
      )}
    </>
  )
}
