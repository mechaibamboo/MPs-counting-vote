"use client"

import { useRef } from "react"
import { Plus, Minus, Trash2, Trophy, Edit2, Check, X, User, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { CandidateViewProps } from "./types"

const MAX_IMAGE_WIDTH = 400

function resizeImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img")
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement("canvas")
      let { width, height } = img
      if (width > MAX_IMAGE_WIDTH) {
        height = (height * MAX_IMAGE_WIDTH) / width
        width = MAX_IMAGE_WIDTH
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(url)
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      try {
        resolve(canvas.toDataURL("image/jpeg", 0.85))
      } catch {
        reject(new Error("Could not encode image"))
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not load image"))
    }
    img.src = url
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// EDIT HERE: Candidate photo paths by add order (index in the original list).
// Index 0 = first added candidate, 1 = second, etc. Missing indices show a placeholder.
// ═══════════════════════════════════════════════════════════════════════════════
const CANDIDATE_PHOTOS: Record<number, string> = {
  0: "/images/candidate1.jpg",
  1: "/images/candidate2.jpg",
  2: "/images/candidate3.jpg",
}
// ═══════════════════════════════════════════════════════════════════════════════

export function PosterView({
  candidates,
  leaderId,
  editingId,
  editingName,
  onAddVote,
  onRemoveVote,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onEditingNameChange,
  onRemoveCandidate,
  getPercentage,
  getRank,
  onUpdateCandidateImage,
}: CandidateViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadingForIdRef = useRef<string | null>(null)
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)

  const handleUploadClick = (candidateId: string) => {
    if (!onUpdateCandidateImage) return
    uploadingForIdRef.current = candidateId
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const id = uploadingForIdRef.current
    e.target.value = ""
    uploadingForIdRef.current = null
    if (!file || !id || !onUpdateCandidateImage) return
    if (!file.type.startsWith("image/")) return
    try {
      const dataUrl = await resizeImageAsDataUrl(file)
      onUpdateCandidateImage(id, dataUrl)
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />
      {sortedCandidates.map((candidate) => {
        const originalIndex = candidates.findIndex((c) => c.id === candidate.id)
        const imageSrc = candidate.image ?? CANDIDATE_PHOTOS[originalIndex]
        const isLeader = candidate.id === leaderId
        const percentage = getPercentage(candidate.votes)
        const rank = getRank(candidate)

        return (
          <Card
            key={candidate.id}
            className={`border-2 transition-all ${
              isLeader ? "ring-2 ring-amber-500 border-amber-500 bg-amber-500/5" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4 md:gap-6">
                {/* Photo - portrait style on left; upload overlay when supported */}
                <div className="relative w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 shrink-0 rounded-lg overflow-hidden bg-muted group">
                  {imageSrc ? (
                    <>
                      <img
                        src={imageSrc}
                        alt={candidate.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                          if (placeholder) placeholder.classList.remove("hidden")
                        }}
                      />
                      <div className="absolute inset-0 hidden flex items-center justify-center bg-muted" aria-hidden>
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {onUpdateCandidateImage && (
                    <button
                      type="button"
                      className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer border-0"
                      onClick={() => handleUploadClick(candidate.id)}
                      title="Upload photo"
                    >
                      <Upload className="h-6 w-6 text-white" />
                      <span className="text-xs text-white/90">Upload photo</span>
                    </button>
                  )}
                </div>

                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted shrink-0">
                  {isLeader ? (
                    <Trophy className="h-6 w-6 text-amber-500" />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">#{rank}</span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  {editingId === candidate.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingName}
                        onChange={(e) => onEditingNameChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSaveEdit()
                          if (e.key === "Escape") onCancelEdit()
                        }}
                        className="text-xl font-semibold h-10"
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" onClick={onSaveEdit}>
                        <Check className="h-5 w-5 text-emerald-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={onCancelEdit}>
                        <X className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-xl md:text-2xl font-semibold truncate">{candidate.name}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onStartEditing(candidate)}
                        className="h-8 w-8 shrink-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="mt-1">
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>

                {/* Votes */}
                <div className="text-center shrink-0 min-w-[80px]">
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{candidate.votes}</p>
                  <p className="text-sm text-muted-foreground">{percentage}%</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onRemoveVote(candidate.id)}
                    className="h-12 w-12"
                    disabled={candidate.votes === 0}
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => onAddVote(candidate.id)}
                    className="h-12 w-12 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveCandidate(candidate.id)}
                    className="h-12 w-12 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
