import { z } from 'zod'

export default function createZodEnum<T extends [string, ...string[]]>(values: readonly [...T]) {
  return z.enum(values as T);
}
