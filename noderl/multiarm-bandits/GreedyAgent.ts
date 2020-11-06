import { argmax } from '../utils/lists'
import BaseAgent from './BaseAgent'

export default class GreedyAgent extends BaseAgent {

  greedy_action(): number {
    // Greedy action
    const action = argmax(this.qValues)
    return this.pull(action)
  }

  act() {
    return this.greedy_action()
  }
}
