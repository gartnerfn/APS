"use client"
import { LapTimesChart } from "@/components/dashboard/lap-times-chart"
import { SpeedChart } from "@/components/dashboard/speed-chart"
import { PositionChart } from "@/components/dashboard/position-chart"
import { TelemetryChart } from "@/components/dashboard/telemetry-chart"
import { DriverComparison } from "@/components/dashboard/driver-comparison"
import { RaceStats } from "@/components/dashboard/race-stats"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

export default function F1Dashboard() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">Dashboard de Escudería F1</h1>
            <p className="text-muted-foreground text-lg">Análisis en tiempo real del rendimiento del equipo</p>
          </div>

          {/* Race Stats */}
          <RaceStats />

          {/* Main Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <LapTimesChart />
            <SpeedChart />
          </div>

          {/* Position and Telemetry */}
          <div className="grid gap-6 md:grid-cols-2">
            <PositionChart />
            <TelemetryChart />
          </div>

          {/* Driver Comparison */}
          <DriverComparison />
        </div>
      </div>
    </>
  )
}
