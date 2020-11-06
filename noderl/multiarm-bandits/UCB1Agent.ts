import { argmax } from '../utils/lists'
import BaseAgent from './BaseAgent'

export default class UCB1Agent extends BaseAgent {
  private plays = 0 // total plays

  ucbAction() {
    const plays = ++this.plays
    const values = this.qValues.map((estimate, i) => {
      const arm_count = this.armCounts[i]
      return estimate + Math.sqrt(2 * Math.log(plays)/ arm_count)
    })

    const action = argmax(values)
    return this.pull(action)
  }

  act(): number {
    return this.ucbAction()
  }
}
