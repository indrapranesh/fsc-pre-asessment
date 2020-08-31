export interface AdditionalQuestion {
    new_fsc_question: string;
    new_is_root: string;
    new_fsc_additional_questionid: string;
}

export interface AdditionalOption {
    new_fsc_answer: string;
    _new_fsc_question_value: string;
    _new_next_question_value: string;
    new_fsc_additional_answerid: string;
    new_fsc_outcome?: string;
    new_fsc_risk_level?: string;
    new_is_end?: boolean;
}