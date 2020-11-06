import { fill, zeros, range } from '../utils/lists'
import { choice } from '../utils/random'

export default class BaseAgent {
  public name: string
  protected armCounts: number[]
  protected qValues: number[]
  protected actions: number[]

  get estimates(): number[] {
    return this.qValues
  }

  get counts(): number[] {
    return this.armCounts
  }

  constructor(nArms: number, initValue: number = 0) {
    this.name = `${this.constructor.name}_arms-${nArms}_init-${initValue}`
    this.armCounts = zeros([nArms])
    this.qValues = fill([nArms], initValue)
    this.actions = range(nArms)
  }

  pull(arm: number) {
    this.armCounts[arm]++
    return arm
  }

  randomAction(): number {
    const action = choice(this.actions)
    return this.pull(action)
  }

  act(): number {
    return this.randomAction()
  }

  optimize(action: number, reward: number) {
    const old_stimate = this.qValues[action]
    const step_size = 1/this.armCounts[action]

    // Algorithm in section 2.4 of Sutton & Barto book
    this.qValues[action] = old_stimate + step_size * (reward - old_stimate)
  }
}
