import { fill, Size } from "../utils/lists"

enum Action {
  LEFT = 0,
  DOWN = 1,
  RIGHT = 2,
  UP = 3,
}

type Position = [number, number]
type State = number
type Tile = 'S' | 'F' | 'H' | 'G'
type LakeMap = Tile[][]
type LakeMapDict = { [size: string]: LakeMap }

export interface Transition {
  prob: number,
  nextState: State,
  reward: number,
  done: boolean,
}

export type MDP = Transition[][][]

export default class FrozenLakeEnv {

  static MAPS: LakeMapDict = {
    '4x4': [
      ['S', 'F', 'F', 'F'],
      ['F', 'H', 'F', 'H'],
      ['F', 'F', 'F', 'H'],
      ['H', 'F', 'F', 'G']
    ],
    '8x8': [
      ['S', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
      ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
      ['F', 'F', 'F', 'H', 'F', 'F', 'F', 'F'],
      ['F', 'F', 'F', 'F', 'F', 'H', 'F', 'F'],
      ['F', 'F', 'F', 'H', 'F', 'F', 'F', 'F'],
      ['F', 'H', 'H', 'F', 'F', 'F', 'H', 'F'],
      ['F', 'H', 'F', 'F', 'H', 'F', 'H', 'F'],
      ['F', 'F', 'F', 'H', 'F', 'F', 'F', 'G']
    ]
  }

  static generateLake(size: Size, probFrozen: number): LakeMap {
    // TODO: implement a random generator
    return FrozenLakeEnv.MAPS['4x4']
  }

  private size: Size
  private lake: LakeMap = []
  private current_state: State = 0
  
  public nActions: number = 4 // LEFT DOWN RIGHT UP
  public nStates: number = 0
  public dynamics: MDP

  constructor(size: Size = [4, 4], is_slippery = true, probFrozen = 0.8) {
    this.size = size
    this.lake = FrozenLakeEnv.generateLake(size, probFrozen)
    this.nStates = size[0] * size[1]

    this.computeDynamics(is_slippery)
  }

  private toState(position: Position): State {
    const [ row, col ] = position
    return row * this.size[1] + col
  }

  private toPosition(state: State): Position {
    const row = Math.floor(state / this.size[1])
    const col = state - row * this.size[1]
    return [row, col] as Position
  }

  private calcNextPosition(position: Position, action: Action): Position {
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

  private getTile(position: Position): Tile {
    const [ row, col ] = position
    return this.lake[row][col]
  }

  private getTransition(position: Position, action: Action): Transition {
    const next_position = this.calcNextPosition(position, action)
    const tile = this.getTile(next_position)
    const nextState = this.toState(next_position)
    const done = ['H', 'G'].includes(tile)
    const reward = Number(tile === 'G')

    return {
      prob: 1.0,
      nextState,
      reward,
      done,
    }
  }

  private computeDynamics(is_slippery: boolean): void {
    const { size, nStates, nActions } = this
    const dynamics = this.dynamics = fill<Transition[][], Transition[]>([nStates, nActions])

    for(let row = 0; row < size[0]; row++){
      for(let col = 0; col < size[1]; col++){

        const position = [row, col] as Position
        const state = this.toState(position)

        for(let action = 0; action < nActions; action++) {
          dynamics[state][action] = dynamics[state][action] || []
          
          const tile = this.getTile(position)

          if (['H', 'G'].includes(tile)) {

            dynamics[state][action].push({
              prob: 1.0,
              nextState: state,
              reward: 0,
              done: true,
            })

          } else if (is_slippery) {

            // Floor is slippery, this means that two other
            // actions could happen if you take a step in a
            // direction. E.g.
            //   Intended direction: up (or down)
            //   Unintended outcome: left or right
            //
            //   Intended direction: right (or left)
            //   Unintended outcome: up or down
            const potential_actions = [
              (action - 1) % nActions, // unintended
              action, // intended
              (action + 1) % nActions, // unintended
            ]
            const n_all = potential_actions.length

            for(let a of potential_actions) {
              const transition = this.getTransition(position, a)
              transition.prob = 1/n_all // uniform probs
              dynamics[state][action].push(transition)
            }

          } else {
            const transition = this.getTransition(position, action)
            dynamics[state][action].push(transition)
          }
        }
      }
    }
  }

  reset(): State {
    return this.current_state = 0
  }

  step(action: Action): Transition {
    const current_position = this.toPosition(this.current_state)
    const transition = this.getTransition(current_position, action)
    this.current_state = transition.nextState
    return transition
  }
}
