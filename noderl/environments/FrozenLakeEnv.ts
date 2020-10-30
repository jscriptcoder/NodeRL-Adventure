import { choice_NxN } from "../utils/random"

interface Transition {
  prob: number,
  next_state: number,
  reward: number,
  done: boolean,
}

export default class FrozenLakeEnv {

  static MAPS = {
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

  static generate_lake(size: Size, prob_frozen: number): Matrix<string> {
    // TODO: implement a random generator
    return FrozenLakeEnv.MAPS['4x4']
  }

  private lake: Matrix<string> = []
  private n_actions: number = 4
  private n_states: number
  private MDP: Matrix<Transition[]> = []
  private current_state: Coordinates

  constructor(size: Size = [4, 4], is_slippery = true, prob_frozen = 0.8) {
    this.lake = FrozenLakeEnv.generate_lake(size, prob_frozen)
    this.n_states = size[0] * size[1]

  }

  step(action: number) {

  }
}
