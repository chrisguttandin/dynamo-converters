export type TArrayType<T> = T extends (infer U)[] ? U : never;
