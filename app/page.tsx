import { Header } from "@/components/header"
import { CalendarSection } from "@/components/calendar-section"
import { DriversSection } from "@/components/drivers-section"
import { TeamsSection } from "@/components/teams-section"
import { PenaltiesSection } from "@/components/penalties-section"
import { StandingsSection } from "@/components/standings-section"
import { MultimediaSection } from "@/components/multimedia-section"
import { FloatingChat } from "@/components/floating-chat"
import { FiaSection } from "@/components/fia-section"
import { TeamPostsSection } from "@/components/team-posts-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-16">
        <CalendarSection />
        <DriversSection />
        <TeamsSection />
        <TeamPostsSection />
        <StandingsSection />
        <PenaltiesSection />
        <FiaSection />
        <MultimediaSection />
        <FloatingChat />
      </main>
    </div>
  )
}
