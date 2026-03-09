export interface Candidate {
  id: string
  name: string
  votes: number
  /** Optional image path for Poster view. Edit manually or use CANDIDATE_PHOTOS in poster-view.tsx */
  image?: string
}

export type ViewMode = "grid" | "compact" | "list" | "table" | "poster"

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
  /** Optional: used by Poster view for photo upload */
  onUpdateCandidateImage?: (id: string, image: string | null) => void
}
