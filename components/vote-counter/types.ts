export interface Candidate {
  id: string
  name: string
  votes: number
}

export type ViewMode = "grid" | "compact" | "list" | "table"

export interface CandidateViewProps {
  candidates: Candidate[]
  leaderId: string | undefined
  totalVotes: number
  editingId: string | null
  editingName: string
  onAddVote: (id: string) => void
  onRemoveVote: (id: string) => void
  onStartEditing: (candidate: Candidate) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onEditingNameChange: (name: string) => void
  onRemoveCandidate: (id: string) => void
  getPercentage: (votes: number) => number
  getRank: (candidate: Candidate) => number
}
