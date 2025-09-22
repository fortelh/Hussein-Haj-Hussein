import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer id="kontakt" className="bg-card border-t border-border py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-card-foreground mb-6 text-balance">Kontakt</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Haben Sie ein Projekt im Bereich Elektrotechnik? Lassen Sie uns gemeinsam innovative Lösungen entwickeln.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">E-Mail</h3>
            <p className="text-muted-foreground">hussein@elektrotechnik.de</p>
          </div>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Telefon</h3>
            <p className="text-muted-foreground">+49 (0) 123 456 789</p>
          </div>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Standort</h3>
            <p className="text-muted-foreground">Deutschland</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <Button size="lg" className="text-lg px-8 py-3">
            Projekt besprechen
          </Button>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h3 className="text-xl font-bold text-card-foreground mb-2">Hussein Haj Hussein</h3>
              <p className="text-muted-foreground">Elektroingenieur - Strom im Blut</p>
            </div>

            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">© 2024 Hussein Haj Hussein. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
