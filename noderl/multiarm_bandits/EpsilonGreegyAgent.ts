import { uniform, choice } from '../utils/random'
import { range } from '../utils/lists'
import GreedyAgent from './GreedyAgent'

export default class EpsilonGreedyAgent extends GreedyAgent {
  private eps: number
  protected explored: number = 0
  protected exploited: number = 0

  constructor(n_arms: number, eps: number, init_value: number = 0) {
    super(n_arms, init_value)
    this.name += `_eps-${eps}`
    this.eps = eps
  }

  act(): number {
    if (uniform() < this.eps) {
      this.explored++
      return this.random_action()
    } else {
      this.exploited++
      return this.greedy_action()
    }
  }

  explore_exploit_rate(): number[] {
    const total = this.explored + this.exploited
    return [this.explored/total, this.exploited/total]
  }
}
