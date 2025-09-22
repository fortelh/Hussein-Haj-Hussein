import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/electrical-components-and-circuits-in-nature--prof.jpg"
          alt="Electrical engineering background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          Hussein Haj Hussein
        </h1>
        <h2 className="text-xl sm:text-2xl lg:text-3xl text-primary font-medium mb-8 text-balance">Elektroingenieur</h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty leading-relaxed">
          Strom im Blut - Mein Weg als Elektroingenieur. Spezialisiert auf Schaltschrankbau, Verkabelung und innovative
          Elektrotechnik-Lösungen.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="text-lg px-8 py-3">
            Projekte entdecken
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
            Kontakt aufnehmen
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  )
}
