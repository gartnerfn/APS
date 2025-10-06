"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { distance: 0, speed: 0 },
  { distance: 200, speed: 180 },
  { distance: 400, speed: 280 },
  { distance: 600, speed: 320 },
  { distance: 800, speed: 340 },
  { distance: 1000, speed: 350 },
  { distance: 1200, speed: 330 },
  { distance: 1400, speed: 280 },
  { distance: 1600, speed: 220 },
  { distance: 1800, speed: 180 },
  { distance: 2000, speed: 240 },
  { distance: 2200, speed: 300 },
  { distance: 2400, speed: 320 },
]

export function SpeedChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Velocidad en Pista</CardTitle>
        <CardDescription>Velocidad a lo largo del circuito</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="distance"
              stroke="#9CA3AF"
              label={{ value: "Distancia (m)", position: "insideBottom", offset: -5, fill: "#9CA3AF" }}
            />
            <YAxis
              stroke="#9CA3AF"
              label={{ value: "Velocidad (km/h)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F3F4F6",
              }}
            />
            <Legend wrapperStyle={{ color: "#F3F4F6" }} />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#DC2626"
              strokeWidth={3}
              dot={{ fill: "#DC2626", r: 4 }}
              activeDot={{ r: 6 }}
              name="Velocidad"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
