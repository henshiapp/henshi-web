import { Flashcard } from "./Flashcard"

export type CardCollection = {
    id: string,
    title: string,
    description: string | null,
    icon: string,
    userId: string,
    createdAt: string,
    updatedAt: string,
    flashcards: Flashcard[]
}