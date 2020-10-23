import { min, max } from '../utils/lists'
import { uniform } from '../utils/random'
import { assert } from '../utils/assertion'

export default class BanditEnv {

  private n_arms: number
  private p_dist: number[]
  private r_dist: number[]

  constructor(p_dist: number[], r_dist: number[]) {

    assert(p_dist.length !== 0, 'Empty probability distribution')
    assert(r_dist.length !== 0, 'Empty reward distribution')
    assert(p_dist.length === r_dist.length, 'Probability and Reward distribution must be the same length')
    assert(min(p_dist) >= 0 && max(p_dist) <= 1, 'All probabilities must be between 0 and 1')

    this.n_arms = p_dist.length
    this.p_dist = p_dist
    this.r_dist = r_dist
  }

  pull(action: number) {
    assert(action >= 0 && action < this.n_arms, `Wrong accion passed in: "${action}"`)

    let reward = 0

    if (uniform() < this.p_dist[action]) {
      reward = this.r_dist[action]
    }

    return reward
  }
}
