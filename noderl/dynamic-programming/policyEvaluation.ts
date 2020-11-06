import FrozenLakeEnv, { Transition, MDP } from '../environments/FrozenLakeEnv'
import { zeros } from '../utils/lists'
import { Policy, StateValue } from './types'

function bellmanExpectationEquation(
  env: FrozenLakeEnv, 
  policy: Policy, 
  V: number[], 
  state: number, 
  gamma: number,
): number {
  const { nActions, dynamics } = env
  let sum = 0

  for (let action = 0; action < nActions; action++ ) {
    const action_prob = policy[state][action]
    for (let transition of dynamics[state][action]) {
      const { prob, nextState, reward } = transition
      sum += action_prob * prob * (reward + (gamma * V[nextState]))
    }
  }

  return sum
}

export default function policyEvaluation(env: FrozenLakeEnv, policy: Policy, gamma=1, theta=1e-8): StateValue {
  const V: StateValue = zeros<number>([env.nStates])

  while (true) {
    let delta = 0

    for(let state = 0; state < env.nStates; state++) {
      const vs = V[state]
      V[state] = bellmanExpectationEquation(env, policy, V, state, gamma)
      delta = Math.max(delta, Math.abs(vs - V[state]))
    }

    if (delta < theta) break
  }

  return V
}
