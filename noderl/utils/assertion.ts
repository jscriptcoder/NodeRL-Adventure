export class AssertionError extends Error {
  name: string = 'AssertionError'
  constructor(message?: string) {
    super(message)
  }
}

export function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new AssertionError(message)
  }
}
