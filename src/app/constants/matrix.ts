export const matrix = [
    {
        'filter1': 'PP',
        'Likely': [
            { filter2: 'TR/S', filter3: 'CW'},{ filter2: 'TR/S', filter3: 'REC'},{ filter2: 'TR/S', filter3: 'MLT'},{ filter2: 'TR/S', filter3: 'OUT'},{ filter2: 'TR/S', filter3: 'LAB'},
            { filter2: 'TRwS', filter3: 'CW'},{ filter2: 'TRwS', filter3: 'REC'},{ filter2: 'TRwS', filter3: 'LAB'},
            { filter2: 'PC', filter3: 'CW'},{ filter2: 'PC', filter3: 'REC'},{ filter2: 'PC', filter3: 'MLT'},{ filter2: 'PC', filter3: 'OUT'},{ filter2: 'PC', filter3: 'LAB'}
        ],
        'NotLikely': [
            { filter2: 'TRwS', filter3: 'MLT'},{ filter2: 'TRwS', filter3: 'OUT'},
            { filter2: 'PCT', filter3: 'CW'},{ filter2: 'PCT', filter3: 'REC'},{ filter2: 'PCT', filter3: 'MLT'},{ filter2: 'PCT', filter3: 'OUT'},{ filter2: 'PCT', filter3: 'LAB'}
        ]
    },
    {
        'filter1': 'SP',
        'Likely': [
            { filter2: 'TR/S', filter3: 'CW'},{ filter2: 'TR/S', filter3: 'REC'},{ filter2: 'TR/S', filter3: 'MLT'},{ filter2: 'TR/S', filter3: 'OUT'},{ filter2: 'TR/S', filter3: 'LAB'},
            { filter2: 'TRwS', filter3: 'LAB'},
            { filter2: 'PC', filter3: 'CW'},{ filter2: 'PC', filter3: 'REC'},{ filter2: 'PC', filter3: 'MLT'},{ filter2: 'PC', filter3: 'OUT'},{ filter2: 'PC', filter3: 'LAB'},
        ],
        'NotLikely': [
            { filter2: 'TRwS', filter3: 'CW'},{ filter2: 'TRwS', filter3: 'REC'},{ filter2: 'TRwS', filter3: 'MLT'},{ filter2: 'TRwS', filter3: 'OUT'},
            { filter2: 'PCT', filter3: 'CW'},{ filter2: 'PCT', filter3: 'REC'},{ filter2: 'PCT', filter3: 'MLT'},{ filter2: 'PCT', filter3: 'OUT'},{ filter2: 'PCT', filter3: 'LAB'}
        ]
    },
    {
        'filter1': 'TDwPP',
        'Likely': [
            { filter2: 'TR/S', filter3: 'CW'},{ filter2: 'TR/S', filter3: 'REC'},{ filter2: 'TR/S', filter3: 'MLT'},{ filter2: 'TR/S', filter3: 'OUT'},{ filter2: 'TR/S', filter3: 'LAB'},
            { filter2: 'TRwS', filter3: 'CW'},{ filter2: 'TRwS', filter3: 'REC'},{ filter2: 'TRwS', filter3: 'MLT'},{ filter2: 'TRwS', filter3: 'OUT'},{ filter2: 'TRwS', filter3: 'LAB'},
            { filter2: 'PC', filter3: 'CW'},{ filter2: 'PC', filter3: 'REC'},{ filter2: 'PC', filter3: 'MLT'},{ filter2: 'PC', filter3: 'OUT'},{ filter2: 'PC', filter3: 'LAB'}
        ],
        'NotLikely': [
            { filter2: 'PCT', filter3: 'CW'},{ filter2: 'PCT', filter3: 'REC'},{ filter2: 'PCT', filter3: 'MLT'},{ filter2: 'PCT', filter3: 'OUT'},{ filter2: 'PCT', filter3: 'LAB'}
        ]
    },
    {
        'filter1': 'TD/PP',
        'Likely': [
            { filter2: 'TR/S', filter3: 'CW'},{ filter2: 'TR/S', filter3: 'REC'},{ filter2: 'TR/S', filter3: 'MLT'},{ filter2: 'TR/S', filter3: 'OUT'},{ filter2: 'TR/S', filter3: 'LAB'},
            { filter2: 'TRwS', filter3: 'CW'},{ filter2: 'TRwS', filter3: 'REC'},{ filter2: 'TRwS', filter3: 'MLT'},{ filter2: 'TRwS', filter3: 'OUT'},{ filter2: 'TRwS', filter3: 'LAB'},
        ],
        'NotLikely': [
            { filter2: 'PC', filter3: 'CW'},{ filter2: 'PC', filter3: 'REC'},{ filter2: 'PC', filter3: 'MLT'},{ filter2: 'PC', filter3: 'OUT'},{ filter2: 'PC', filter3: 'LAB'},
            { filter2: 'PCT', filter3: 'CW'},{ filter2: 'PCT', filter3: 'REC'},{ filter2: 'PCT', filter3: 'MLT'},{ filter2: 'PCT', filter3: 'OUT'},{ filter2: 'PCT', filter3: 'LAB'}
        ]
    }
];

export const FilterOutcome = [
    {
        outcome: 'Primary Producer',
        code: 'PP'
    },
    {
        outcome: 'Secondary Producer',
        code: 'SP'
    },
    {
        outcome: 'Traders with physical possession',
        code: 'TDwPP'
    },
    {
        outcome: 'Traders without physical possession',
        code: 'TD/PP'
    },
    {
        outcome: 'Transfer system (no physical/temporal segregation)',
        code: 'TR/S'
    },
    {
        outcome: 'Transfer system (with segregation)',
        code: 'TRwS'
    },
    {
        outcome: 'Percentage/Credit system',
        code: 'PC'
    },
    {
        outcome: 'All three systems or a combination of them',
        code: 'PCT'
    },
    {
        outcome: 'Sourcing Controlled Wood/controlled material',
        code: 'CW'
    },
    {
        outcome: 'Sourcing recycling material',
        code: 'REC'
    },
    {
        outcome: 'Group/multisite',
        code: 'MLT'
    },
    {
        outcome: 'Outsourcing',
        code: 'OUT'
    },
    {
        outcome: 'Labelling',
        code: 'LAB'
    },
    {
        outcome: 'All scenarios w/t traders',
        code: 'CRMOL'
    },
    {
        outcome: 'No possibility for remote audit. Please contact certification body in your area. [no requirements shall be retrieved from req. schema]',
        code: 'NO'
    }
]