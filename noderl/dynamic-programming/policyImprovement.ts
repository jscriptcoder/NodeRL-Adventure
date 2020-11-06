import FrozenLakeEnv from "../environments/FrozenLakeEnv"
import { argmax, zeros } from "../utils/lists"
import { Policy, StateValue } from './types'

function qFromV(env: FrozenLakeEnv, V: StateValue, state: number, gamma: number): number[] {
  const { nActions, dynamics } = env
  const q = zeros<number>([env.nActions])

  for (let action = 0; action < nActions; action++ ) {
    let sum = 0

    for (let transition of dynamics[state][action]) {
      const { prob, nextState, reward } = transition
      sum += prob * (reward + (gamma * V[nextState]))
    }

    q[action] = sum
  }

  return q
}

export default function policyImprovement(env: FrozenLakeEnv, V: StateValue, gamma=1): Policy {
  const policy = zeros<number[]>([
    env.nStates, 
    env.nActions]).map(row => 
    row.map(val => val / env.nActions)
  )

  for(let state = 0; state < env.nStates; state++) {
    const q = qFromV(env, V, state, gamma)
    policy[state][argmax(q)] = 1 // deterministic policy
  }

  return policy
}
