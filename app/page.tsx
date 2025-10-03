import { Header } from "@/components/header"
import { CalendarSection } from "@/components/calendar-section"
import { DriversSection } from "@/components/drivers-section"
import { PenaltiesSection } from "@/components/penalties-section"
import { StandingsSection } from "@/components/standings-section"
import MultimediaSection from "@/components/multimedia-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-16">
        <CalendarSection />
        <DriversSection />
        <StandingsSection />
        <PenaltiesSection />
        <MultimediaSection />
      </main>
    </div>
  )
}
