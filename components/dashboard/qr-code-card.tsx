"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Pencil, Trash2 } from "lucide-react"

interface QRCodeCardProps {
  id: string
  name: string
  description: string | null
  dataUrl: string
  createdAt: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function QRCodeCard({ id, name, description, dataUrl, createdAt, onEdit, onDelete }: QRCodeCardProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `${name.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-lg truncate">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-center mb-4">
          <img src={dataUrl || "/placeholder.svg"} alt={name} className="w-full max-w-[200px] h-auto" />
        </div>
        {description && <p className="text-sm text-gray-500 line-clamp-2">{description}</p>}
        <p className="text-xs text-gray-400 mt-2">Created: {formatDate(createdAt)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
