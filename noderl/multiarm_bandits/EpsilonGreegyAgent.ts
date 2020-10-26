import { uniform, choice } from '../utils/random'
import { range } from '../utils/lists'
import GreedyAgent from './GreedyAgent'

export default class EpsilonGreedyAgent extends GreedyAgent {
  private eps: number

  constructor(n_arms: number, eps: number, init_value: number = 0) {
    super(n_arms, init_value)
    this.eps = eps
  }

  act(): number {
    if (uniform() < this.eps) {
      return this.random_action()
    } else {
      return this.greedy_action()
    }
  }
}
