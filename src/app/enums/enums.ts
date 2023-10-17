export type Tag = {
  id: Number
  tagName: String
}

export type Flashcard =
  | {
      id: number
      question: string
      answer: string
    }
  | {
      question: string
      answer: string
    }

export type Comment = {
  id: number
  comment: string
  creator: User
}

export type User = null | {
  userName: string
  id: number
}
export type Lesson = {
  id: number
  title: string
  description: string
  iconPath: string
  creator: User
  flashcards: Flashcard[]
  tags: Tag[]
  comments: Comment[]
}

export type Bar = {
  hidden: boolean
  mode: 'indeterminate' | 'query' | 'determinate' | 'buffer'
  value: number
}

export type PractiseFlashcard = {
  method: Methods
  variant: ('question' | 'answer')[]
  question: string
  options?: string[]
  answers?: string[]
  answer?: string
}

export enum Methods {
  BOOLEAN = 0,
  MULTIPLE = 1,
  MATCH = 2,
  WRITE = 3,
}
