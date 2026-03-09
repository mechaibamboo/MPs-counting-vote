"use client"

import { Plus, Minus, Trash2, Trophy, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { CandidateViewProps } from "./types"

export function GridView({
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
    <div className="grid gap-6 md:grid-cols-2">
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
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {isLeader && <Trophy className="h-6 w-6 text-amber-500 shrink-0" />}
                  {editingId === candidate.id ? (
                    <div className="flex items-center gap-2 flex-1">
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
                    <CardTitle className="text-2xl md:text-3xl truncate">{candidate.name}</CardTitle>
                  )}
                </div>
                {editingId !== candidate.id && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => onStartEditing(candidate)}>
                      <Edit2 className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveCandidate(candidate.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-5xl md:text-6xl font-bold text-foreground">{candidate.votes}</p>
                  <p className="text-lg text-muted-foreground">{percentage}% of total votes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onRemoveVote(candidate.id)}
                    className="h-16 w-16 text-2xl"
                    disabled={candidate.votes === 0}
                  >
                    <Minus className="h-8 w-8" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => onAddVote(candidate.id)}
                    className="h-16 w-16 text-2xl bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-8 w-8" />
                  </Button>
                </div>
              </div>
              <Progress value={percentage} className="h-4" />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
