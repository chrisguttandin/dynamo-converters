import type { createIsReservedWord } from './is-reserved-word';

export const createIsIllegalWord =
    (illegalWordRegex: RegExp, isReservedWord: ReturnType<typeof createIsReservedWord>) =>
    (property: string): boolean =>
        illegalWordRegex.test(property) || isReservedWord(property);
