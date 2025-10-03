import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

const penalties = [
  {
    race: "GP de Bahréin",
    driver: "Kevin Magnussen",
    team: "Haas F1 Team",
    penalty: "5 segundos",
    reason: "Causar colisión",
    date: "MAR 16",
    severity: "medium",
  },
  {
    race: "GP de Arabia Saudita",
    driver: "Logan Sargeant",
    team: "Williams Racing",
    penalty: "10 segundos",
    reason: "Exceso de velocidad en pit lane",
    date: "MAR 23",
    severity: "high",
  },
  {
    race: "GP de Arabia Saudita",
    driver: "Yuki Tsunoda",
    team: "AlphaTauri",
    penalty: "5 segundos",
    reason: "Límites de pista",
    date: "MAR 23",
    severity: "low",
  },
  {
    race: "GP de Bahréin",
    driver: "Nico Hülkenberg",
    team: "Haas F1 Team",
    penalty: "3 posiciones en parrilla",
    reason: "Impedir vuelta rápida",
    date: "MAR 16",
    severity: "medium",
  },
  {
    race: "GP de Arabia Saudita",
    driver: "Zhou Guanyu",
    team: "Alfa Romeo",
    penalty: "5 segundos",
    reason: "Salida en falso",
    date: "MAR 23",
    severity: "medium",
  },
  {
    race: "GP de Bahréin",
    driver: "Pierre Gasly",
    team: "Alpine",
    penalty: "Advertencia",
    reason: "Límites de pista",
    date: "MAR 16",
    severity: "low",
  },
]

export function PenaltiesSection() {
  return (
    <section id="sanciones" className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-10 w-10 text-primary" />
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">SANCIONES</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {penalties.map((penalty, index) => (
          <Card key={index} className="bg-card border-border p-5 hover:border-primary transition-colors">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-muted-foreground mb-1">{penalty.date}</div>
                  <h3 className="font-bold text-foreground">{penalty.race}</h3>
                </div>
                <Badge
                    className={
                      penalty.severity === "high"
                        ? "!bg-red-600 !text-white px-2 py-0.5 rounded-md"
                        : penalty.severity === "medium"
                          ? "!bg-yellow-500 !text-black px-2 py-0.5 rounded-md"
                          : "!bg-gray-200 !text-gray-800 px-2 py-0.5 rounded-md"
                    }
                >
                  {penalty.penalty}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-lg text-foreground">{penalty.driver}</div>
                <div className="text-sm text-muted-foreground">{penalty.team}</div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="text-sm text-muted-foreground">Motivo:</div>
                <div className="text-sm font-medium text-foreground">{penalty.reason}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
