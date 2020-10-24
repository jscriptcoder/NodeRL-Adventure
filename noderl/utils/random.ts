import { assert } from "./assertion"

export function uniform() {
    return Math.random()
}

export function randint(low = 0, high?: number) {
  if (typeof high === 'undefined') {
    [low, high] = [0, low]
  }

  assert(high > low, 'low >= high')

  return Math.floor(Math.random() * (high - low) + low)
}

export function choice<T>(list: T[]): T {
  if (list.length === 1) {
    return list[0]
  }
  
  const rndi = randint(list.length)
  return list[rndi]
}
