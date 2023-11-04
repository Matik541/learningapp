export class CallError {
  statusCode: number = 0
  message: string = ''
  error: string = ''

  constructor(err: any) {
    this.statusCode = err?.status
    this.message = err?.message
    this.error = err?.error
  }
}

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
}

export type CommentUser = Comment & {
  creator: User
}

export type CommentLesson = Comment & {
  lesson: {
    id: number
  }
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
  comments: CommentUser[]
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

export type UserMe = {
  id: number
  userName: string
  email: string
  createdLessons: {
    id: number
    title: string
    description: string
    iconPath: string
  }[]
  comments: {
    id: number
    comment: string
  }[]
  lessonsCompleted: {
    id: number
    score: number
  }[]
}

export enum Methods {
  BOOLEAN = 'boolean',
  MULTIPLE = 'multiple',
  MATCH = 'match',
  WRITE = 'write',
}
