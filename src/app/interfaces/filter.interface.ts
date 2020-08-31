export interface Filter {
    question: {
        title: string;
        options: Array<Options>;
    };
}

export interface Options {
    value: string;
    result?: string;
    question: Filter;
}