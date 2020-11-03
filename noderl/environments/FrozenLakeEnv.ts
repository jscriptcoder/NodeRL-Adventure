import { full_matrix } from "../utils/lists"
import { choice_NxN } from "../utils/random"

enum Action {
  LEFT = 0,
  DOWN = 1,
  RIGHT = 2,
  UP = 3,
}

type Position = [number, number]
type State = number
type Tile = 'S' | 'F' | 'H' | 'G'
type LakeMap = Matrix<Tile>
type LakeMapDict = { [size: string]: LakeMap }

export interface Transition {
  prob: number,
  next_state: State,
  reward: number,
  done: boolean,
}

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

  static generate_lake(size: Size, prob_frozen: number): LakeMap {
    // TODO: implement a random generator
    return FrozenLakeEnv.MAPS['4x4']
  }

  private size: Size
  private lake: LakeMap = []
  private current_state: State = 0
  public n_actions: number = 4
  public n_states: number = 0

  public MDP: Matrix<Transition[]>

  constructor(size: Size = [4, 4], is_slippery = true, prob_frozen = 0.8) {
    this.size = size
    this.lake = FrozenLakeEnv.generate_lake(size, prob_frozen)
    this.n_states = size[0] * size[1]

    this.compute_dynamics(is_slippery)
  }

  private to_state(position: Position): State {
    const [ row, col ] = position
    return row * this.size[1] + col
  }

  private to_position(state: State): Position {
    const row = Math.floor(state / this.size[1])
    const col = state - row * this.size[1]
    return [row, col] as Position
  }

  private calc_next_position(position: Position, action: Action): Position {
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

  private get_tile(position: Position): Tile {
    const [ row, col ] = position
    return this.lake[row][col]
  }

  private get_transition(position: Position, action: Action): Transition {
    const next_position = this.calc_next_position(position, action)
    const tile = this.get_tile(next_position)
    const next_state = this.to_state(next_position)
    const done = ['H', 'G'].includes(tile)
    const reward = Number(tile === 'G')

    return {
      prob: 1.0,
      next_state,
      reward,
      done,
    }
  }

  private compute_dynamics(is_slippery: boolean): void {
    const { size, n_states, n_actions } = this
    const MDP = this.MDP = full_matrix([n_states, n_actions], [] as Transition[])

    for(let row = 0; row < size[0]; row++){
      for(let col = 0; col < size[1]; col++){

        const position = [row, col] as Position
        const state = this.to_state(position)

        for(let action = 0; action < n_actions; action++) {
          const tile = this.get_tile(position)

          if (['H', 'G'].includes(tile)) {

            MDP[state][action].push({
              prob: 1.0,
              next_state: state,
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
              (action - 1) % n_actions, // unintended
              action, // intended
              (action + 1) % n_actions, // unintended
            ]
            const n_all = potential_actions.length

            for(let a of potential_actions) {
              const transition = this.get_transition(position, a)
              transition.prob = 1/n_all // uniform probs
              MDP[state][action].push(transition)
            }

          } else {
            const transition = this.get_transition(position, action)
            MDP[state][action].push(transition)
          }
        }
      }
    }
  }

  reset(): State {
    return this.current_state = 0
  }

  step(action: Action): Transition {
    const current_position = this.to_position(this.current_state)
    const transition = this.get_transition(current_position, action)
    this.current_state = transition.next_state
    return transition
  }
}
