import { argmax, full, zeros, range } from '../utils/lists'
import { choice } from '../utils/random'

export default class GreedyAgent {
  protected arms_count: number[]
  protected q_values: number[]
  protected actions: number[]
  protected explored: number = 0
  protected exploited: number = 0

  get estimates(): number[] {
    return this.q_values
  }

  get counts(): number[] {
    return this.arms_count
  }

  constructor(n_arms: number, init_value: number = 0) {
    this.arms_count = zeros(n_arms)
    this.q_values = full(n_arms, init_value)
    this.actions = range(n_arms)
  }

  pull(arm: number) {
    this.arms_count[arm]++
    return arm
  }

  random_action(): number {
    this.explored++
    const action = choice(this.actions)
    return this.pull(action)
  }

  act(): number {
    return this.random_action()
  }

  optimize(action: number, reward: number) {
    const old_stimate = this.q_values[action]
    const step_size = 1/this.arms_count[action]

    // Algorithm in section 2.4 of Sutton & Barto book
    this.q_values[action] = old_stimate + step_size * (reward - old_stimate)
  }

  explore_exploit_rate(): number[] {
    const total = this.explored + this.exploited
    return [this.explored/total, this.exploited/total]
  }
}
