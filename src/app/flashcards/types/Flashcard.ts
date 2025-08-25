export type Grade = 'VeryEasy' | 'Easy' | 'Medium' | 'Hard' | 'VeryHard';

export const getGradeLabel = (grade: Flashcard["grade"]) => {
    switch (grade) {
        case "VeryEasy":
            return "Very easy";
        case "Easy":
            return "Easy";
        case "Medium":
            return "Medium";
        case "Hard":
            return "Hard";
        case "VeryHard":
            return "Very hard";
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