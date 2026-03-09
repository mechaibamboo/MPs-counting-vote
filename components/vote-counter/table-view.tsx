"use client"

import { Plus, Minus, Trash2, Trophy, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CandidateViewProps } from "./types"

export function TableView({
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
  return (
    <Card className="border-2">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-lg font-bold w-20 text-center">Rank</TableHead>
              <TableHead className="text-lg font-bold">Candidate Name</TableHead>
              <TableHead className="text-lg font-bold text-center w-32">Votes</TableHead>
              <TableHead className="text-lg font-bold text-center w-28">Percentage</TableHead>
              <TableHead className="text-lg font-bold text-center w-48">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => {
              const isLeader = candidate.id === leaderId
              const percentage = getPercentage(candidate.votes)
              const rank = getRank(candidate)

              return (
                <TableRow
                  key={candidate.id}
                  className={`${isLeader ? "bg-amber-500/10 hover:bg-amber-500/15" : ""}`}
                >
                  <TableCell className="text-center">
                    {isLeader ? (
                      <div className="flex justify-center">
                        <Trophy className="h-6 w-6 text-amber-500" />
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-muted-foreground">#{rank}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === candidate.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => onEditingNameChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") onSaveEdit()
                            if (e.key === "Escape") onCancelEdit()
                          }}
                          className="text-lg font-semibold h-10 max-w-xs"
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
                        <span className={`text-xl font-semibold ${isLeader ? "text-amber-700" : ""}`}>
                          {candidate.name}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onStartEditing(candidate)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`text-2xl font-bold ${isLeader ? "text-amber-700" : ""}`}>
                      {candidate.votes}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`text-xl font-semibold ${isLeader ? "text-amber-700" : ""}`}>
                      {percentage}%
                    </span>
                  </TableCell>
                  <TableCell>
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
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRemoveCandidate(candidate.id)}
                        className="h-10 w-10 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
