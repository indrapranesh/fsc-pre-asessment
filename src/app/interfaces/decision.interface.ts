export interface Question {
    new_fsc_question: string;
    new_is_root: string;
    new_fsc_questionsid: string;
}

export interface Option {
    new_answer_value: string;
    _new_fsc_question_value: string;
    _new_next_question_value: string;
    new_fsc_answersid: string;
    new_filter_outcome?: string;
    new_scenario_code?: string;
}