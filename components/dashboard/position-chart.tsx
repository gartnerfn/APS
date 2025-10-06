"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { lap: 1, pos1: 3, pos2: 5 },
  { lap: 5, pos1: 3, pos2: 4 },
  { lap: 10, pos1: 2, pos2: 4 },
  { lap: 15, pos1: 2, pos2: 3 },
  { lap: 20, pos1: 1, pos2: 3 },
  { lap: 25, pos1: 1, pos2: 2 },
  { lap: 30, pos1: 1, pos2: 2 },
]

export function PositionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Posición en Carrera</CardTitle>
        <CardDescription>Evolución de posiciones durante la carrera</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="lap"
              stroke="#9CA3AF"
              label={{ value: "Vuelta", position: "insideBottom", offset: -5, fill: "#9CA3AF" }}
            />
            <YAxis
              stroke="#9CA3AF"
              label={{ value: "Posición", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
              reversed
              domain={[1, 10]}
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
              type="stepAfter"
              dataKey="pos1"
              stroke="#DC2626"
              strokeWidth={3}
              dot={{ fill: "#DC2626", r: 5 }}
              name="Piloto 1"
            />
            <Line
              type="stepAfter"
              dataKey="pos2"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", r: 5 }}
              name="Piloto 2"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
