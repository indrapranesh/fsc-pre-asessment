export const Filter1 = {
    question: "Do you produce products or only trade them?",
    children: [
        {
            question: "Do you physically possess these products?",
            value: 'I only trade FSC products',
            children: [
                {
                    value: 'Yes',
                    result: 'Traders with physical possession'
                },
                {
                    value: 'No',
                    result: 'Traders without physical possession'
                }
            ]
        },
        {
            question: "Are you a primary producer (meaning you use timber coming directly from the forest?)",
            value: 'I produce FSC products',
            children: [
                {
                    value: 'Yes',
                    result: 'Primary Producer'
                },
                {
                    value: 'No',
                    result: 'Secondary Producer'
                }
            ]
        }
    ]
}