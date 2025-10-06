import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Zap, Clock, TrendingUp } from "lucide-react"

export function RaceStats() {
  const stats = [
    {
      title: "Posición Actual",
      value: "P1",
      icon: Trophy,
      change: "+2",
      changeType: "positive" as const,
    },
    {
      title: "Velocidad Máxima",
      value: "352 km/h",
      icon: Zap,
      change: "+8 km/h",
      changeType: "positive" as const,
    },
    {
      title: "Mejor Vuelta",
      value: "1:29.4",
      icon: Clock,
      change: "-0.6s",
      changeType: "positive" as const,
    },
    {
      title: "Rendimiento",
      value: "98.5%",
      icon: TrendingUp,
      change: "+2.3%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-sm text-chart-3 font-medium">{stat.change}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
