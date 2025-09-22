"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  currentImageUrl?: string
  onImageUploaded: (url: string) => void
  onImageRemoved: () => void
}

export function ImageUpload({ currentImageUrl, onImageUploaded, onImageRemoved }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onImageUploaded(data.url)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError("Failed to upload image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return

    try {
      await fetch("/api/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: currentImageUrl }),
      })
    } catch (error) {
      console.error("Error deleting image:", error)
    }

    onImageRemoved()
  }

  return (
    <div className="space-y-4">
      <Label className="text-slate-200">Project Image</Label>

      {currentImageUrl ? (
        <div className="relative">
          <div className="relative w-full h-48 bg-slate-700 rounded-lg overflow-hidden">
            <Image src={currentImageUrl || "/placeholder.svg"} alt="Project image" fill className="object-cover" />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-600 border-red-600 text-white hover:bg-red-700"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No image uploaded</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      )}

      <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {!currentImageUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Choose Image"}
        </Button>
      )}

      {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
    </div>
  )
}
