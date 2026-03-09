"use client"

import { Plus, Minus, Trash2, Trophy, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { CandidateViewProps } from "./types"

export function ListView({
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
}: CandidateViewProps) {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)

  return (
    <div className="space-y-3">
      {sortedCandidates.map((candidate) => {
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
              <div className="flex items-center gap-4">
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
                      <Button size="icon" variant="ghost" onClick={() => onStartEditing(candidate)} className="h-8 w-8 shrink-0">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="mt-1">
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>

                {/* Vote Count */}
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
