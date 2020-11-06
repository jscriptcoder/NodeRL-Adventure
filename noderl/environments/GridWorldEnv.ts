import { assert } from "../utils/assertion"
import { fill } from "../utils/lists"
import { Transition } from "./Env"

export type State = number

export enum Action {
  LEFT = 0,
  DOWN = 1,
  RIGHT = 2,
  UP = 3,
}

export type Position = [number, number]

export interface TransitionWithProb extends Transition<number> {
  prob: Probability
}

export type MDP = TransitionWithProb[][][]

export function toState(position: Position, size: Size): number {
  const [ row, col ] = position
  return row * size[1] + col
}

export function toPosition(state: State, size: Size): Position {
  const row = Math.floor(state / size[1])
  const col = state - row * size[1]
  return [row, col] as Position
}

export default abstract class GridWorld<G extends T[][], T> {

  protected size: Size
  protected grid: G
  protected current_state: State = 0
  
  public nActions: number = 4
  public nStates: number
  public dynamics: MDP

  constructor(size: Size, ...args: any[]) {

    assert(size && size.length === 2, 'Size should be [int, int]')

    this.size = size
    this.nStates = size[0] * size[1]
  }

  protected toState(position: Position): State {
    return toState(position, this.size)
  }

  protected toPosition(state: State): Position {
    return toPosition(state, this.size)
  }

  protected calcNextPosition(position: Position, action: Action): Position {
    let [ row, col ] = position

    switch(action) {
      case Action.LEFT:
        col = Math.max(col - 1, 0)
        break
      case Action.DOWN:
        row = Math.min(row + 1, this.size[0] - 1)
        break;
      case Action.RIGHT:
        col = Math.min(col + 1, this.size[1] - 1)
        break
      case Action.UP:
        row = Math.max(row - 1, 0)
    }

    return [row, col] as Position
  }

  protected getTile(position: Position): T {
    const [ row, col ] = position
    return this.grid[row][col]
  }

  protected abstract calcReward(tile: T): number

  protected abstract calcDone(tile: T): Done

  protected getTransition(position: Position, action: Action): TransitionWithProb {
    const next_position = this.calcNextPosition(position, action)
    const tile = this.getTile(next_position)
    const nextState = this.toState(next_position)
    const reward = this.calcReward(tile)
    const done = this.calcDone(tile)

    return {
      prob: 1.0,
      nextState,
      reward,
      done,
    }
  }

  protected computeDynamics(...args: any[]): MDP {
    const { nStates, nActions } = this

    assert(nStates > 0 && nActions > 0, 'Num. of states and/or actions < 1')

    return this.dynamics = fill<TransitionWithProb[][], TransitionWithProb[]>([nStates, nActions])
  }

  reset(): State {
    return this.current_state = 0
  }

  step(action: Action): TransitionWithProb {
    const current_position = this.toPosition(this.current_state)
    const transition = this.getTransition(current_position, action)
    this.current_state = transition.nextState
    return transition
  }
}
