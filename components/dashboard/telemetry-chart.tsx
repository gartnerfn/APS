"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { time: 0, throttle: 0, brake: 0, gear: 1 },
  { time: 2, throttle: 100, brake: 0, gear: 3 },
  { time: 4, throttle: 100, brake: 0, gear: 5 },
  { time: 6, throttle: 100, brake: 0, gear: 7 },
  { time: 8, throttle: 50, brake: 0, gear: 7 },
  { time: 10, throttle: 0, brake: 100, gear: 5 },
  { time: 12, throttle: 0, brake: 80, gear: 3 },
  { time: 14, throttle: 60, brake: 0, gear: 4 },
  { time: 16, throttle: 100, brake: 0, gear: 6 },
  { time: 18, throttle: 100, brake: 0, gear: 7 },
]

export function TelemetryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Telemetría</CardTitle>
        <CardDescription>Acelerador y freno en tiempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              label={{ value: "Tiempo (s)", position: "insideBottom", offset: -5, fill: "#9CA3AF" }}
            />
            <YAxis
              stroke="#9CA3AF"
              label={{ value: "Porcentaje (%)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
              domain={[0, 100]}
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
            <Line type="monotone" dataKey="throttle" stroke="#10B981" strokeWidth={2} dot={false} name="Acelerador" />
            <Line type="monotone" dataKey="brake" stroke="#DC2626" strokeWidth={2} dot={false} name="Freno" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
