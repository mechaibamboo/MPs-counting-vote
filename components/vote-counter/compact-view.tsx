"use client"

import { Plus, Minus, Trash2, Trophy, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { CandidateViewProps } from "./types"

export function CompactView({
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
}: CandidateViewProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {candidates.map((candidate) => {
        const isLeader = candidate.id === leaderId
        const percentage = getPercentage(candidate.votes)

        return (
          <Card
            key={candidate.id}
            className={`border-2 transition-all ${
              isLeader ? "ring-2 ring-amber-500 border-amber-500 bg-amber-500/5" : ""
            }`}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isLeader && <Trophy className="h-4 w-4 text-amber-500 shrink-0" />}
                  {editingId === candidate.id ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => onEditingNameChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSaveEdit()
                          if (e.key === "Escape") onCancelEdit()
                        }}
                        className="text-base font-semibold h-8"
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" onClick={onSaveEdit} className="h-7 w-7">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={onCancelEdit} className="h-7 w-7">
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold truncate">{candidate.name}</p>
                  )}
                </div>
                {editingId !== candidate.id && (
                  <div className="flex items-center shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => onStartEditing(candidate)} className="h-7 w-7">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveCandidate(candidate.id)}
                      className="h-7 w-7 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{candidate.votes}</p>
                <p className="text-sm text-muted-foreground">{percentage}%</p>
              </div>

              <Progress value={percentage} className="h-2" />

              <div className="flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveVote(candidate.id)}
                  className="h-10 w-10"
                  disabled={candidate.votes === 0}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAddVote(candidate.id)}
                  className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
