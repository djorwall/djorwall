import Link from "next/link"
import { ArrowLeft, CheckCircle2, Mail, MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Sample data for the agent profile
const agentData = {
  id: 1,
  name: "Sarah Johnson",
  company: "Elite Talent Management",
  avatar: "/professional-woman-short-hair.png",
  coverImage: "/placeholder.svg?height=400&width=1200&query=modern office space with city view",
  verified: true,
  location: "Los Angeles, CA",
  email: "sarah@elitetalent.com",
  phone: "+1 (323) 555-7890",
  website: "www.elitetalentmgmt.com",
  bio: "Representing top fashion, beauty, and lifestyle influencers with a combined reach of over 50 million followers. With 8+ years of experience in talent management, I help brands connect with the perfect influencers for their campaigns.",
  rating: 4.9,
  reviews: 124,
  categories: ["Fashion", "Beauty", "Lifestyle"],
  influencerCount: 45,
  sheets: [
    {
      id: 1,
      name: "Fashion Influencers 2024",
      influencers: 24,
      categories: ["Fashion", "Beauty"],
    },
    {
      id: 2,
      name: "Beauty Creators Network",
      influencers: 18,
      categories: ["Beauty", "Skincare"],
    },
    {
      id: 3,
      name: "Lifestyle Influencers",
      influencers: 15,
      categories: ["Lifestyle", "Travel"],
    },
  ],
  pastWork: [
    {
      id: 1,
      title: "Summer Fashion Campaign for Zara",
      image: "/placeholder.svg?height=300&width=400&query=fashion campaign photoshoot",
      description:
        "Managed a team of 5 influencers for Zara's summer collection launch, resulting in 2.5M impressions and 15% engagement rate.",
    },
    {
      id: 2,
      title: "Beauty Product Launch for Sephora",
      image: "/placeholder.svg?height=300&width=400&query=beauty product launch event",
      description:
        "Coordinated 8 beauty influencers for Sephora's new skincare line, generating over 1M in sales within the first week.",
    },
    {
      id: 3,
      title: "Travel Content Series for Airbnb",
      image: "/placeholder.svg?height=300&width=400&query=travel influencer at luxury destination",
      description:
        "Produced a 6-part travel content series with 3 lifestyle influencers, showcasing Airbnb's luxury properties.",
    },
  ],
  reviews: [
    {
      id: 1,
      name: "Nike Marketing Team",
      avatar: "/placeholder.svg?height=50&width=50&query=N",
      rating: 5,
      date: "2 months ago",
      comment:
        "Sarah was incredible to work with. She understood our brand needs perfectly and matched us with the ideal influencers for our campaign.",
    },
    {
      id: 2,
      name: "Glossier Brand",
      avatar: "/placeholder.svg?height=50&width=50&query=G",
      rating: 5,
      date: "3 months ago",
      comment:
        "Elite Talent Management provided us with exceptional service. The influencers were professional and delivered high-quality content on time.",
    },
    {
      id: 3,
      name: "Adidas Team",
      avatar: "/placeholder.svg?height=50&width=50&query=A",
      rating: 4,
      date: "5 months ago",
      comment:
        "Great experience working with Sarah and her team. The campaign exceeded our expectations in terms of reach and engagement.",
    },
  ],
}

export default function AgentProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative h-64 w-full md:h-80">
          <img src={agentData.coverImage || "/placeholder.svg"} alt="Cover" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container px-4 md:px-6">
          <div className="relative -mt-20 mb-6 flex flex-col items-center md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col items-center md:flex-row md:items-end">
              <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-background md:mb-0 md:mr-4">
                <img
                  src={agentData.avatar || "/placeholder.svg"}
                  alt={agentData.name}
                  className="h-full w-full object-cover"
                />
                {agentData.verified && (
                  <div className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-1 text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start">
                  <h1 className="text-2xl font-bold md:text-3xl">{agentData.name}</h1>
                  {agentData.verified && <Badge className="ml-2 bg-blue-500 text-white">Verified</Badge>}
                </div>
                <p className="text-lg text-muted-foreground">{agentData.company}</p>
                <div className="mt-2 flex items-center justify-center md:justify-start">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">{agentData.rating}</span>
                    <span className="ml-1 text-muted-foreground">({agentData.reviews} reviews)</span>
                  </div>
                  <div className="mx-2 h-4 w-px bg-border" />
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{agentData.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 md:mt-0">
              <Button asChild variant="outline">
                <Link href={`mailto:${agentData.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Link>
              </Button>
              <Button>Request Sheet Access</Button>
            </div>
          </div>

          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/brand">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="about" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="sheets">Sheets</TabsTrigger>
              <TabsTrigger value="work">Past Work</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">About {agentData.name}</h2>
                  <p className="mb-6 text-muted-foreground">{agentData.bio}</p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium">Contact Information</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{agentData.email}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4 text-muted-foreground"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <span>{agentData.phone}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4 text-muted-foreground"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </svg>
                          <span>{agentData.website}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {agentData.categories.map((category) => (
                          <Badge key={category} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-4 text-sm">
                        <span className="font-medium">{agentData.influencerCount}</span> influencers in network
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sheets" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Available Influencer Sheets</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {agentData.sheets.map((sheet) => (
                      <Card key={sheet.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="aspect-video bg-muted">
                            <img
                              src={`/placeholder.svg?height=200&width=400&query=${sheet.name} influencers collage`}
                              alt={sheet.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium">{sheet.name}</h3>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {sheet.categories.map((category) => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{sheet.influencers} influencers</p>
                            <Button asChild className="mt-4 w-full">
                              <Link href={`/sheets/${sheet.id}`}>Request Access</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="work" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Past Work</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {agentData.pastWork.map((work) => (
                      <div key={work.id} className="overflow-hidden rounded-lg border">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={work.image || "/placeholder.svg"}
                            alt={work.title}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{work.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground">{work.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Client Reviews</h2>
                  <div className="space-y-6">
                    {agentData.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={review.avatar || "/placeholder.svg"}
                              alt={review.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <h3 className="font-medium">{review.name}</h3>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
