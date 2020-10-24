import { uniform, choice } from '../utils/random'
import { range } from '../utils/lists'
import GreedyAgent from './GreedyAgent'

export default class EpsilonGreedyAgent extends GreedyAgent {
  private eps: number
  private actions: number[]

  constructor(n_arms: number, eps: number) {
    super(n_arms)
    this.eps = eps
    this.actions = range(n_arms)
  }

  act() {
    if (uniform() > this.eps) {
      // Takes greedy action
      return super.act()
    } else {
      // Takes randomm action
      return choice(this.actions)
    }
  }
}
