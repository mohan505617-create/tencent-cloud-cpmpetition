export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BackLink {
  fromNoteId: string;
  toNoteId: string;
  fromTitle: string;
  toTitle: string;
}

export interface AIRecommendation {
  id: string;
  type: 'related_note' | 'create_note' | 'add_tag';
  title: string;
  description: string;
  confidence: number;
  noteId?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'related_note' | 'create_note' | 'add_tag';
  title: string;
  description: string;
  confidence: number;
  noteId?: string;
}

export interface SearchResult {
  note: Note;
  score: number;
  matchedFields: string[];
}

export interface InspirationSuggestion {
  id: string;
  type: 'connection' | 'question' | 'idea';
  content: string;
  relatedNotes: string[];
}

export interface BacklinkMap {
  [noteId: string]: string[];
}