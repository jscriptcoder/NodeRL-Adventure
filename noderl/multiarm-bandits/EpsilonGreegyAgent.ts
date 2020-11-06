import { uniform } from '../utils/random'
import GreedyAgent from './GreedyAgent'

export default class EpsilonGreedyAgent extends GreedyAgent {
  private eps: number
  protected explored: number = 0
  protected exploited: number = 0

  constructor(nArms: number, eps: number, initValue: number) {
    super(nArms, initValue)
    this.name += `_eps-${eps}`
    this.eps = eps
  }

  act(): number {
    if (uniform() < this.eps) {
      this.explored++
      return this.randomAction()
    } else {
      this.exploited++
      return this.greedy_action()
    }
  }

  exploreExploitRate(): number[] {
    const total = this.explored + this.exploited
    return [this.explored/total, this.exploited/total]
  }
}
