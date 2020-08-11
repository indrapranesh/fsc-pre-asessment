export interface Decision {
    questionText: string;
    questionId: string;
    options: Options[];
}

export interface Options {
    optionText: string;
    optionId: string;
    nextQuestionId: string;
    outcome?: string;
}

export interface FilterResponse {
    questionId: string;
    optionId: string;
}