import { argmax, full, zeros, range } from '../utils/lists'
import { choice } from '../utils/random'

export default class BaseAgent {
  public name: string
  protected arm_counts: number[]
  protected q_values: number[]
  protected actions: number[]

  get estimates(): number[] {
    return this.q_values
  }

  get counts(): number[] {
    return this.arm_counts
  }

  constructor(n_arms: number, init_value: number = 0) {
    this.name = `${this.constructor.name}_arms-${n_arms}_initvals-${init_value}`
    this.arm_counts = zeros(n_arms)
    this.q_values = full(n_arms, init_value)
    this.actions = range(n_arms)
  }

  pull(arm: number) {
    this.arm_counts[arm]++
    return arm
  }

  random_action(): number {
    const action = choice(this.actions)
    return this.pull(action)
  }

  act(): number {
    return this.random_action()
  }

  optimize(action: number, reward: number) {
    const old_stimate = this.q_values[action]
    const step_size = 1/this.arm_counts[action]

    // Algorithm in section 2.4 of Sutton & Barto book
    this.q_values[action] = old_stimate + step_size * (reward - old_stimate)
  }
}
