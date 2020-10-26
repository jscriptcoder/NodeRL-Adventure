import { argmax } from '../utils/lists'
import BaseAgent from './BaseAgent'

export default class GreedyAgent extends BaseAgent {

  greedy_action(): number {
    // Greedy action
    this.exploited++
    const action = argmax(this.q_values)
    return this.pull(action)
  }

  act() {
    return this.greedy_action()
  }
}
