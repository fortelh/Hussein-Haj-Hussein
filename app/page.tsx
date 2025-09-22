import { Hero } from "@/components/hero"
import { Navigation } from "@/components/navigation"
import { ProjectsGrid } from "@/components/projects-grid"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ProjectsGrid projects={projects || []} />
      <About />
      <Footer />
    </main>
  )
}
