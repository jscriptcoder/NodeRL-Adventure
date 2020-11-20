import { assert } from "../utils/assertion"
import { fill } from "../utils/lists"
import { DiscreteStep, TransitionWithProb } from "./Env"

export type GridState = number
export type GridTransition = TransitionWithProb<Discrete>

export enum GridAction {
  LEFT = 0,
  DOWN = 1,
  RIGHT = 2,
  UP = 3,
}

export type GridPosition = [number, number]

export type MDP = GridTransition[][][]

export function toState(position: GridPosition, size: Size): number {
  const [ row, col ] = position
  return row * size[1] + col
}

export function toPosition(state: GridState, size: Size): GridPosition {
  const row = Math.floor(state / size[1])
  const col = state - row * size[1]
  return [row, col] as GridPosition
}

export default abstract class GridWorld<G extends T[][], T> {

  protected size: Size
  protected grid: G
  protected current_state: GridState = 0
  
  public nActions: number = 4
  public nStates: number
  public dynamics: MDP

  constructor(size: Size, ...args: any[]) {

    assert(size && size.length === 2, 'Size should be [int, int]')

    this.size = size
    this.nStates = size[0] * size[1]
  }

  protected toState(position: GridPosition): GridState {
    return toState(position, this.size)
  }

  protected toPosition(state: GridState): GridPosition {
    return toPosition(state, this.size)
  }

  protected calcNextPosition(position: GridPosition, action: GridAction): GridPosition {
    let [ row, col ] = position

    switch(action) {
      case GridAction.LEFT:
        col = Math.max(col - 1, 0)
        break
      case GridAction.DOWN:
        row = Math.min(row + 1, this.size[0] - 1)
        break;
      case GridAction.RIGHT:
        col = Math.min(col + 1, this.size[1] - 1)
        break
      case GridAction.UP:
        row = Math.max(row - 1, 0)
    }

    return [row, col] as GridPosition
  }

  protected getTile(position: GridPosition): T {
    const [ row, col ] = position
    return this.grid[row][col]
  }

  protected abstract calcReward(tile: T): Reward

  protected abstract calcDone(tile: T): Done

  protected getTransition(position: GridPosition, action: GridAction): GridTransition {
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

    return this.dynamics = fill<GridTransition[][], GridTransition[]>([nStates, nActions])
  }

  reset(): DiscreteState {
    return this.current_state = 0
  }

  step(action: GridAction): GridTransition {
    const current_position = this.toPosition(this.current_state)
    const transition = this.getTransition(current_position, action)
    this.current_state = transition.nextState
    return transition
  }
}
