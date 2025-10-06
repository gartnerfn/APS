"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { lap: 1, driver1: 92.5, driver2: 93.1 },
  { lap: 2, driver1: 91.8, driver2: 92.4 },
  { lap: 3, driver1: 91.2, driver2: 91.9 },
  { lap: 4, driver1: 90.8, driver2: 91.5 },
  { lap: 5, driver1: 90.5, driver2: 91.2 },
  { lap: 6, driver1: 90.3, driver2: 90.9 },
  { lap: 7, driver1: 90.1, driver2: 90.7 },
  { lap: 8, driver1: 89.9, driver2: 90.5 },
  { lap: 9, driver1: 89.8, driver2: 90.4 },
  { lap: 10, driver1: 89.6, driver2: 90.2 },
  { lap: 11, driver1: 89.5, driver2: 90.1 },
  { lap: 12, driver1: 89.4, driver2: 90.0 },
]

export function LapTimesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiempos por Vuelta</CardTitle>
        <CardDescription>Comparación de tiempos entre pilotos</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorDriver1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorDriver2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="lap"
              stroke="#9CA3AF"
              label={{ value: "Vuelta", position: "insideBottom", offset: -5, fill: "#9CA3AF" }}
            />
            <YAxis
              stroke="#9CA3AF"
              label={{ value: "Tiempo (s)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
              domain={[88, 94]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F3F4F6",
              }}
            />
            <Area
              type="monotone"
              dataKey="driver1"
              stroke="#DC2626"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorDriver1)"
              name="Piloto 1"
            />
            <Area
              type="monotone"
              dataKey="driver2"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorDriver2)"
              name="Piloto 2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
