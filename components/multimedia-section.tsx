"use client"

import { Info } from "lucide-react"
import { InstagramEmbed } from "./instagram-embed"

export default function MultimediaSection() {
  return (
    <section id="multimedia" className="flex flex-col  space-y-6">
      <div className="flex gap-3">
        <Info className="h-10 w-10 text-primary" />
        <h2 className="text-5xl font-bold tracking-tighter text-foreground">NOTICIAS</h2>

      </div>
        <InstagramEmbed url="https://www.instagram.com/f1/" />
    </section>
  )
}