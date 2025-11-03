'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getAllDrivers, initializeDefaultDrivers, F1Driver } from "@/lib/default-drivers"
import { DriverModal } from "@/components/driver-modal"

export function DriversSection() {
  const [startIndex, setStartIndex] = useState(0)
  const [allDrivers, setAllDrivers] = useState<F1Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<F1Driver | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const visibleCount = 6

  useEffect(() => {
    // Inicializar pilotos por defecto
    initializeDefaultDrivers()
    
    const pointsFromRaces = (): Map<string, number> => {
      const racesStr = localStorage.getItem('f1_races_results')
      const map = new Map<string, number>()
      if (!racesStr) return map
      try {
        const races = JSON.parse(racesStr) as Array<{ results?: Array<{ position: number; driver: string; number?: string }> }>
        const table = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
        for (const race of races || []) {
          for (const rr of race.results || []) {
            if (!rr?.driver) continue
            const key = `${rr.driver}#${String(rr.number ?? "")}`
            const pts = table[rr.position - 1] || 0
            map.set(key, (map.get(key) || 0) + pts)
          }
        }
      } catch {}
      return map
    }

    // Cargar todos los pilotos (por defecto + manuales + ediciones) y aplicar puntos desde resultados
    const loadDrivers = () => {
      const drivers = getAllDrivers()
      const ptsMap = pointsFromRaces()
      const withPoints = drivers.map(d => ({
        ...d,
        points: ptsMap.get(`${d.name}#${d.number}`) || 0,
      }))
      setAllDrivers(withPoints)
    }
    
    loadDrivers()

    // Listener para actualizaciones de pilotos y carreras
    const handleDriversUpdate = () => loadDrivers()
    const handleRacesUpdate = () => loadDrivers()
    window.addEventListener('f1-drivers-updated', handleDriversUpdate)
    window.addEventListener('f1-races-updated', handleRacesUpdate)
    return () => {
      window.removeEventListener('f1-drivers-updated', handleDriversUpdate)
      window.removeEventListener('f1-races-updated', handleRacesUpdate)
    }
  }, [])

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0))
  }

  const handleNext = () => {
    const nonReserveCount = allDrivers.filter(d => d.status !== 'reserva').length
    setStartIndex((prev) => Math.min(prev + visibleCount, nonReserveCount - visibleCount))
  }

  const handleDriverClick = (driver: F1Driver) => {
    setSelectedDriver(driver)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDriver(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'titular':
        return 'bg-green-100 text-green-800'
      case 'suplente':
        return 'bg-yellow-100 text-yellow-800'
      case 'reserva':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Mostrar solo pilotos que no sean 'reserva' en la vista principal
  const nonReserveDrivers = allDrivers.filter(d => d.status !== 'reserva')
  const visibleDrivers = nonReserveDrivers.slice(startIndex, startIndex + visibleCount)

  return (
    <section id="pilotos" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">PILOTOS 2025</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={startIndex + visibleCount >= nonReserveDrivers.length}
            className="disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {visibleDrivers.map((driver, index) => (
          <Card
            key={driver.id}
            className="overflow-hidden bg-card border-border group hover:border-primary transition-all hover:scale-105 cursor-pointer"
            onClick={() => handleDriverClick(driver)}
          >
            <div className="relative h-64 overflow-hidden bg-secondary">
              <img
                src={driver.image || "/placeholder.svg"}
                alt={driver.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="text-xs font-bold bg-secondary/90 backdrop-blur-sm">
                  {driver.team}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 text-2xl">{driver.country}</div>
              
              {/* Indicador de estado */}
              <div className="absolute bottom-3 left-3">
                <Badge className={`text-xs ${getStatusColor(driver.status)}`}>
                  {driver.status.toUpperCase()}
                </Badge>
              </div>
              
              {/* Overlay de hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="text-4xl font-bold text-muted-foreground">#{driver.number}</div>
              <h3 className="text-lg font-bold tracking-tight text-foreground leading-tight">
                {driver.name}
              </h3>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">{driver.points} puntos</div>
                {driver.role && (
                  <Badge variant="outline" className="text-xs">
                    {driver.role}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de detalles del piloto */}
      <DriverModal 
        driver={selectedDriver}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )

}
