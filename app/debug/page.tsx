"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthDebugPage() {
  const { user, isAdmin, isTeam, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Estado de Autenticación - Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Usuario actual:</h3>
            <pre className="bg-muted p-4 rounded text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold">Roles:</h3>
            <ul className="bg-muted p-4 rounded text-sm">
              <li>isAdmin: {isAdmin ? "✅ true" : "❌ false"}</li>
              <li>isTeam: {isTeam ? "✅ true" : "❌ false"}</li>
              <li>user_role: {user?.user_role || "undefined"}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">LocalStorage:</h3>
            <pre className="bg-muted p-4 rounded text-sm">
              {localStorage.getItem('f1_user') || 'No user data in localStorage'}
            </pre>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => window.location.href = "/admin"}>
              Ir a Admin
            </Button>
            <Button onClick={() => window.location.href = "/escuderia"}>
              Ir a Escudería
            </Button>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}