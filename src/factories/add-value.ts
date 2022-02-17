export const createAddValue =
    (addSymbol: symbol) =>
    (value: number): [symbol, number] =>
        [addSymbol, value];
