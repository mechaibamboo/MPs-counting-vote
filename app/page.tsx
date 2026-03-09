"use client"

import { useState, useEffect } from "react"
import { UserPlus, RotateCcw, LayoutGrid, Grid3X3, List, Table2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GridView } from "@/components/vote-counter/grid-view"
import { CompactView } from "@/components/vote-counter/compact-view"
import { ListView } from "@/components/vote-counter/list-view"
import { TableView } from "@/components/vote-counter/table-view"
import { PosterView } from "@/components/vote-counter/poster-view"
import type { Candidate, ViewMode } from "@/components/vote-counter/types"

export default function VoteCounter() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [newCandidateName, setNewCandidateName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("vote-counter-candidates")
    const savedView = localStorage.getItem("vote-counter-view")
    if (saved) {
      try {
        setCandidates(JSON.parse(saved))
      } catch {
        setCandidates([])
      }
    }
    if (savedView && ["grid", "compact", "list", "table", "poster"].includes(savedView)) {
      setViewMode(savedView as ViewMode)
    }
  }, [])

  // Save to localStorage whenever candidates change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("vote-counter-candidates", JSON.stringify(candidates))
    }
  }, [candidates, mounted])

  // Save view mode preference
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("vote-counter-view", viewMode)
    }
  }, [viewMode, mounted])

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0)
  const maxVotes = Math.max(...candidates.map((c) => c.votes), 0)
  const leaderId = candidates.find((c) => c.votes === maxVotes && maxVotes > 0)?.id

  const addCandidate = () => {
    if (newCandidateName.trim()) {
      setCandidates([
        ...candidates,
        {
          id: crypto.randomUUID(),
          name: newCandidateName.trim(),
          votes: 0,
        },
      ])
      setNewCandidateName("")
    }
  }

  const removeCandidate = (id: string) => {
    setCandidates(candidates.filter((c) => c.id !== id))
  }

  const addVote = (id: string) => {
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, votes: c.votes + 1 } : c)))
  }

  const removeVote = (id: string) => {
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, votes: Math.max(0, c.votes - 1) } : c)))
  }

  const resetAllVotes = () => {
    setCandidates(candidates.map((c) => ({ ...c, votes: 0 })))
  }

  const startEditing = (candidate: Candidate) => {
    setEditingId(candidate.id)
    setEditingName(candidate.name)
  }

  const saveEdit = () => {
    if (editingName.trim() && editingId) {
      setCandidates(candidates.map((c) => (c.id === editingId ? { ...c, name: editingName.trim() } : c)))
    }
    setEditingId(null)
    setEditingName("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  const getRank = (candidate: Candidate) => {
    const sorted = [...candidates].sort((a, b) => b.votes - a.votes)
    return sorted.findIndex((c) => c.id === candidate.id) + 1
  }

  const updateCandidateImage = (id: string, image: string | null) => {
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, image: image ?? undefined } : c)))
  }

  const viewProps = {
    candidates,
    leaderId,
    totalVotes,
    editingId,
    editingName,
    onAddVote: addVote,
    onRemoveVote: removeVote,
    onStartEditing: startEditing,
    onSaveEdit: saveEdit,
    onCancelEdit: cancelEdit,
    onEditingNameChange: setEditingName,
    onRemoveCandidate: removeCandidate,
    getPercentage,
    getRank,
    onUpdateCandidateImage: updateCandidateImage,
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight text-balance">
            Student Council Election
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">Vote Counting System</p>
        </div>

        {/* Stats Bar */}
        <Card className="border-2">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 md:gap-8">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">Total Votes</p>
                  <p className="text-3xl md:text-5xl font-bold text-foreground">{totalVotes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">Candidates</p>
                  <p className="text-3xl md:text-5xl font-bold text-foreground">{candidates.length}</p>
                </div>
              </div>
              <Button variant="destructive" size="lg" onClick={resetAllVotes} className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Reset All Votes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* View Switcher + Add Candidate */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* View Switcher */}
          <Card className="border-2 flex-shrink-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">View:</span>
                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(value) => value && setViewMode(value as ViewMode)}
                  variant="outline"
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view" className="gap-2 px-4">
                    <LayoutGrid className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="compact" aria-label="Compact grid view" className="gap-2 px-4">
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Compact</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view" className="gap-2 px-4">
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">List</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="table" aria-label="Table view" className="gap-2 px-4">
                    <Table2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Table</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="poster" aria-label="Poster view" className="gap-2 px-4">
                    <ImageIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Poster</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>

          {/* Add Candidate */}
          <Card className="border-2 flex-1">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter candidate name..."
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCandidate()}
                  className="text-lg h-12"
                />
                <Button size="lg" onClick={addCandidate} className="h-12 px-6 gap-2 shrink-0">
                  <UserPlus className="h-5 w-5" />
                  <span className="hidden sm:inline">Add Candidate</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Display */}
        {candidates.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="p-12 text-center">
              <p className="text-2xl text-muted-foreground">No candidates added yet.</p>
              <p className="text-lg text-muted-foreground mt-2">Add candidates above to start counting votes.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === "grid" && <GridView {...viewProps} />}
            {viewMode === "compact" && <CompactView {...viewProps} />}
            {viewMode === "list" && <ListView {...viewProps} />}
            {viewMode === "table" && <TableView {...viewProps} />}
            {viewMode === "poster" && <PosterView {...viewProps} />}
          </>
        )}

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm">
          Data is automatically saved to your browser. Refresh to see your saved data.
        </div>
      </div>
    </main>
  )
}
