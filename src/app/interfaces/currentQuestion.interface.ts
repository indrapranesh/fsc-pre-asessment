export interface CurrentDecision {
    questionText: string;
    questionId: string;
    options: CurrentOption[];
}

export interface CurrentOption {
    optionText: string;
    optionId: string;
    nextQuestionId: string;
    outcome?: string;
    isSelected: boolean;
    endAccessment?: boolean;
    scenarioCode?: string;
    riskLevel?: string;
}

export interface FilterResponse {
    questionId: string;
    option: string;
    outcome?: string;
    riskLevel?: string;
}