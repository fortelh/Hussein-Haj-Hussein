import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Award, Users, Lightbulb } from "lucide-react"

const skills = [
  "Schaltschrankbau",
  "Elektroinstallation",
  "DC/AC Verkabelung",
  "Brandschutztechnik",
  "Industrieautomation",
  "Sicherheitssysteme",
  "Projektmanagement",
  "Qualitätskontrolle",
]

const achievements = [
  {
    icon: Zap,
    title: "Elektrotechnik-Expertise",
    description: "Über 10 Jahre Erfahrung in der Elektrotechnik mit Fokus auf industrielle Anwendungen.",
  },
  {
    icon: Award,
    title: "Zertifizierte Qualität",
    description: "Alle Projekte entsprechen höchsten Sicherheits- und Qualitätsstandards.",
  },
  {
    icon: Users,
    title: "Teamarbeit",
    description: "Erfolgreiche Zusammenarbeit mit interdisziplinären Teams und Kunden.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Kontinuierliche Weiterentwicklung und Anwendung neuester Technologien.",
  },
]

export function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">Über mich</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Als leidenschaftlicher Elektroingenieur bringe ich technische Expertise und kreative Problemlösungen
            zusammen. Mein Fokus liegt auf qualitativ hochwertigen, sicheren und innovativen Elektrotechnik-Lösungen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src="/professional-electrical-engineer-in-workshop--tech.jpg"
              alt="Hussein Haj Hussein"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Meine Philosophie</h3>
            <p className="text-muted-foreground leading-relaxed">
              "Strom im Blut" - das beschreibt meine Leidenschaft für die Elektrotechnik perfekt. Seit Jahren arbeite
              ich daran, komplexe elektrische Systeme zu entwickeln und zu optimieren. Dabei steht für mich nicht nur
              die technische Perfektion im Vordergrund, sondern auch die Sicherheit und Nachhaltigkeit meiner Lösungen.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Von der Planung bis zur Umsetzung begleite ich meine Projekte mit höchster Präzision und Aufmerksamkeit
              für Details. Jedes Projekt ist eine neue Herausforderung, die ich mit Begeisterung und fachlicher
              Kompetenz angehe.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-card-foreground mb-2">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">Kompetenzen</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
