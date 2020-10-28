import Beta from '@stdlib/math/base/special/beta'
import { ones, argmax } from '../utils/lists'
import BaseAgent from "./BaseAgent"

export default class ThomsonSamplingAgent extends BaseAgent {
  private a: number[]
  private b: number[]

  constructor(n_arms: number, init_value: number) {
    super(n_arms, init_value)
    this.a = ones(n_arms)
    this.b = ones(n_arms)
  }

  sample_action(): number {
    const values = this.q_values.map((estimate, i) => {
      const [a, b] = [this.a[i], this.b[i]]
      return Beta(a, b) // samples from a Beta distribution
    })

    const action = argmax(values)
    return this.pull(action)
  }

  act() {
    return this.sample_action()
  }

  optimize(action: number, reward: number) {
    super.optimize(action, reward)
    
    this.a[action] += reward
    this.b[action] += 1 - reward
  }
}
