import { choice } from './random'
import { assert } from "./assertion"

export type Size = number[]

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

function recursive_fill<T, V>(size: Size, value: V, dim: number): V | T[] {
  if (dim === size.length) {
    return value
  } else {
    return Array(size[dim])
      .fill(recursive_fill(size, value, dim+1))
      // Otherwise we'll have the same array instance on each segment
      .map(item => Array.isArray(item) ? item.slice(0) : item)
  }
}

export function fill<T, V>(size: Size, value: V = null): T[] {
  return recursive_fill<T, V>(size, value, 0) as T[]
}

export function zeros<T>(size: Size): T[] {
  return fill<T, number>(size, 0)
}

export function ones<T>(size: Size): T[] {
  return fill<T, number>(size, 1)
}
