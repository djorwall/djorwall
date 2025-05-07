import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "This platform has completely transformed how I manage my influencer network. The auto-fetch feature saves me hours every week.",
      author: "Sarah Johnson",
      role: "Talent Agent",
      avatar: "/professional-woman-short-hair.png",
      rating: 5,
    },
    {
      quote:
        "As a brand, finding the right influencers used to be a nightmare. Now I can browse verified agent profiles and see real-time data.",
      author: "Michael Chen",
      role: "Marketing Director",
      avatar: "/asian-businessman.png",
      rating: 5,
    },
    {
      quote:
        "The viewer tracking feature is a game-changer. I know exactly which brands are interested in my influencers.",
      author: "Jessica Williams",
      role: "Influencer Manager",
      avatar: "/placeholder.svg?key=gzg0d",
      rating: 4,
    },
  ]

  return (
    <section className="bg-white py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">What Our Users Say</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from agents and brands who have transformed their influencer management
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mb-6 italic text-muted-foreground">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
