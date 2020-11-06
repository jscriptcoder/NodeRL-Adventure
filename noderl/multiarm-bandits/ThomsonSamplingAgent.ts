import Beta from '@stdlib/math/base/special/beta'
import { ones, argmax } from '../utils/lists'
import BaseAgent from "./BaseAgent"

export default class ThomsonSamplingAgent extends BaseAgent {
  private a: number[]
  private b: number[]

  constructor(nArms: number, initValue: number) {
    super(nArms, initValue)
    this.a = ones([nArms])
    this.b = ones([nArms])
  }

  sampleAction(): number {
    const values = this.qValues.map((estimate, i) => {
      const [a, b] = [this.a[i], this.b[i]]
      return Beta(a, b) // samples from a Beta distribution
    })

    const action = argmax(values)
    return this.pull(action)
  }

  act() {
    return this.sampleAction()
  }

  optimize(action: number, reward: number) {
    super.optimize(action, reward)
    
    this.a[action] += reward
    this.b[action] += 1 - reward
  }
}
