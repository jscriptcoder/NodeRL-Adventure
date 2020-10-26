import { choice } from './random'
import { assert } from "./assertion"

export function min(list: number[]): number {
    return Math.min(...list)
}

export function max(list: number[]): number {
    return Math.max(...list)
}

export function argmax(list: number[]): number {
  let top = -Infinity
  let ties: number[] = []

  for(let i = 0, len = list.length; i < len; i++) {
    if (list[i] > top) {
      top = list[i]
      ties = [i]
    } else if (list[i] === top) {
      ties.push(i)
    }
  }

  return choice(ties)
}

export function range(start = 0, stop?: number): number[] {
  let size
  if (typeof stop === 'undefined') {
    [size, start] = [start, 0]
  } else {
    size = stop - start
  }

  assert(size > 0, `Wrong size: ${size}`)

  return [...Array(size).keys()].map(i => i + start)
}

export function full(size: number, value: number) {
  return Array(size).fill(value)
}

export function zeros(size: number): number[] {
  return full(size, 0)
}


