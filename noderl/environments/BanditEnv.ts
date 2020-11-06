import { min, max } from '../utils/lists'
import { uniform } from '../utils/random'
import { assert } from '../utils/assertion'

export default class BanditEnv {

  private nArms: number
  private pDist: number[]
  private rDist: number[]

  constructor(pDist: number[], rDist: number[]) {

    assert(pDist.length !== 0, 'pDist = []')
    assert(rDist.length !== 0, 'rDist = []')
    assert(pDist.length === rDist.length, 'Not pDist.length == rDist.length')
    assert(min(pDist) >= 0 && max(pDist) <= 1, 'Not 0 <= pDist[i] => 1')

    this.nArms = pDist.length
    this.pDist = pDist
    this.rDist = rDist
  }

  step(action: number) {
    assert(action >= 0 && action < this.nArms, `Wrong accion: ${action}`)

    let reward = 0

    if (uniform() < this.pDist[action]) {
      reward = this.rDist[action]
    }

    return reward
  }
}
