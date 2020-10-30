import { MaxAttrs } from "@tensorflow/tfjs-node"
import { progressBarHelper } from "@tensorflow/tfjs-node/dist/callbacks"
import { assert } from "./assertion"
import { full, full_matrix } from "./lists"

export function uniform() {
    return Math.random()
}

export function randint(low = 0, high?: number) {
  if (typeof high === 'undefined') {
    [low, high] = [0, low]
  }

  assert(high > low, `Not ${high} > ${low}`)

  return Math.floor(uniform() * (high - low) + low)
}

export function choice<T>(list: T[]): T {
  if (list.length === 1) {
    return list[0]
  }
  
  const rndi = randint(list.length)
  return list[rndi]
}

export function choice_NxN<T>(list: T[], size: Size = [1, 1], probs: number[] = []): Matrix<T> {
  if (list.length === 1) {
    return full_matrix(size, list[0])
  }

  if (probs.length === 0) {
    probs = full(list.length, 1/list.length)
  }

  assert(list.length === probs.length, 'Size of values and probs must match')

  const NxN = full_matrix(size, null)

  // TODO: finish implementation

  return NxN
}
