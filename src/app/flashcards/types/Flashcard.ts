export type Flashcard = {
    id: string,
    question: string,
    answer: string,
    grade: 'VERY_EASY' | 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD',
    nextRecall: string,
    createdAt: string,
    updatedAt: string,
    collectionId: string
}