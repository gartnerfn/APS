import { Header } from "@/components/header"
import { CalendarSection } from "@/components/calendar-section"
import { DriversSection } from "@/components/drivers-section"
import { TeamsSection } from "@/components/teams-section"
import { PenaltiesSection } from "@/components/penalties-section"
import { StandingsSection } from "@/components/standings-section"
import { FiaSection } from "@/components/fia-section"
import MultimediaSection from "@/components/multimedia-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-16">
        <CalendarSection />
        <DriversSection />
        <TeamsSection />
        <StandingsSection />
        <PenaltiesSection />
        <FiaSection />
        <MultimediaSection />
      </main>
    </div>
  )
}
