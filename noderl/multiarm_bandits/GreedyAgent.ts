import { argmax } from '../utils/lists'

export default class GreedyAgent {
  private arms_count: number[]
  private q_values: number[]

  constructor(n_arms: number) {
    this.arms_count = Array(n_arms)
    this.q_values = Array(n_arms)
  }

  act() {
    // Greedy action
    return argmax(this.q_values)
  }

  step(action: number, reward: number) {
    const old_stimate = this.q_values[action]
    const step_size = 1/this.arms_count[action]

    // Algorithm in section 2.4 of Sutton & Barto book
    this.q_values[action] = old_stimate + step_size * (reward - old_stimate)
  }
}
