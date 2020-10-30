import { full_matrix } from "../utils/lists"
import { choice_NxN } from "../utils/random"

enum Action {
  LEFT = 0,
  DOWN = 1,
  RIGHT = 2,
  UP = 3,
}

type State = Coordinates
type Tile = 'S' | 'F' | 'H' | 'G'
type LakeMap = Matrix<Tile>
type LakeMapDict = { [size: string]: LakeMap }

interface Transition {
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
  private current_state: Coordinates = [0, 0]
  private n_actions: number = 4
  private n_states: number = 0

  public MDP: Matrix<Transition[]>

  constructor(size: Size = [4, 4], is_slippery = true, prob_frozen = 0.8) {
    this.size = size
    this.lake = FrozenLakeEnv.generate_lake(size, prob_frozen)
    this.n_states = size[0] * size[1]

    this.compute_MDP(is_slippery)
  }

  private compute_MDP(is_slippery: boolean): void {
    const { size, n_actions } = this
    const MDP = this.MDP = full_matrix(size, [] as Transition[])

    for(let row = 0; row < size[0]; row++){
      for(let col = 0; col < size[1]; col++){
        for(let action = 0; action < n_actions; action++) {
          const tile = this.get_tile([row, col])

          if (['H', 'G'].includes(tile)) {

            MDP[row][col].push({
              prob: 1.0,
              next_state: [row, col],
              reward: 0,
              done: true,
            })

          } else if (is_slippery) {

            const all_actions = [
              (action - 1) % n_actions,
              action,
              (action + 1) % n_actions,
            ]

            for(let a of all_actions) {
              const transition = this.get_transition([row, col], a)
              transition.prob = 1/all_actions.length // uniform probs
              MDP[row][col].push(transition)
            }

          } else {
            const transition = this.get_transition([row, col], action)
            MDP[row][col].push(transition)
          }
        }
      }
    }
  }

  private calc_next_state(state: State, action: Action): State {
    let [ row, col ] = state

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

    return [row, col] as State
  }

  private get_tile(state: State): Tile {
    const [ row, col ] = state
    return this.lake[row][col]
  }

  private get_transition(state: State, action: Action): Transition {
    const next_state = this.calc_next_state(state, action)
    const tile = this.get_tile(next_state)
    const done = ['H', 'G'].includes(tile)
    const reward = Number(tile === 'G')

    return {
      prob: 1,
      next_state,
      reward,
      done,
    }
  }

  reset(): State {
    this.current_state = [0, 0]
    return [ ...this.current_state ] // it's safer to clone
  }

  step(action: Action): Transition {
    const transition = this.get_transition(this.current_state, action)
    this.current_state = transition.next_state
    return transition
  }
}
