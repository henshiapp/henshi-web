export type Grade = 'Again' | 'Easy' | 'Good' | 'Hard';

export const getGradeLabel = (grade: Flashcard["grade"]) => {
    switch (grade) {
        case "Again":
            return "Again";
        case "Easy":
            return "Easy";
        case "Good":
            return "Good";
        case "Hard":
            return "Hard";
    }
};

export type Flashcard = {
    id: string,
    question: string,
    answer: string,
    grade: Grade,
    nextRecall: string,
    createdAt: string,
    updatedAt: string,
    collectionId: string
}