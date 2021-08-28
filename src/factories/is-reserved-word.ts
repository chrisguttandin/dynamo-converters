export const createIsReservedWord =
    (reservedWords: string[]) =>
    (word: string): boolean =>
        reservedWords.some((reservedWord) => reservedWord === word.toUpperCase());
