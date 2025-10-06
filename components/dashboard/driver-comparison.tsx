"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { metric: "Mejor Vuelta", driver1: 89.4, driver2: 90.0 },
  { metric: "Vel. Máx", driver1: 352, driver2: 348 },
  { metric: "Vel. Prom", driver1: 245, driver2: 242 },
  { metric: "Adelantos", driver1: 8, driver2: 6 },
]

export function DriverComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Pilotos</CardTitle>
        <CardDescription>Estadísticas clave del rendimiento</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis type="number" stroke="#9CA3AF" />
            <YAxis type="category" dataKey="metric" stroke="#9CA3AF" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F3F4F6",
              }}
            />
            <Legend wrapperStyle={{ color: "#F3F4F6" }} />
            <Bar dataKey="driver1" fill="#DC2626" radius={[0, 4, 4, 0]} name="Piloto 1" />
            <Bar dataKey="driver2" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Piloto 2" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
