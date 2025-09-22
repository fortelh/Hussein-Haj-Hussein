import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Zap, Cable, Shield, Cpu, User } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  category: string
  image_url: string | null
  created_at: string
  updated_at: string
}

interface ProjectsGridProps {
  projects: Project[]
}

const categoryIcons: Record<string, any> = {
  "control-cabinet": Zap,
  cabling: Cable,
  "heat-detection": Shield,
  experiments: Cpu,
  about: User,
  other: Cpu,
}

const categoryDisplayNames: Record<string, string> = {
  "control-cabinet": "Industrietechnik",
  cabling: "Elektroinstallation",
  "heat-detection": "Sicherheitstechnik",
  experiments: "Innovation",
  about: "Persönlich",
  other: "Sonstiges",
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <section id="projekte" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Meine Projekte
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Ein Überblick über meine Arbeit in der Elektrotechnik - von Schaltschrankbau bis hin zu innovativen
            Sicherheitssystemen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const IconComponent = categoryIcons[project.category] || Cpu
            const categoryDisplay = categoryDisplayNames[project.category] || project.category

            return (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all duration-300 border-border bg-card overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      project.image_url || "/placeholder.svg?height=192&width=384&query=electrical engineering project"
                    }
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {categoryDisplay}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground">{project.title}</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 bg-transparent"
                  >
                    Galerie entdecken
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Keine Projekte verfügbar. Schauen Sie später wieder vorbei!</p>
          </div>
        )}
      </div>
    </section>
  )
}
