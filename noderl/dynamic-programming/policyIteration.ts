import FrozenLakeEnv from '../environments/FrozenLakeEnv'
import { clone, ones } from '../utils/lists'
import { Policy, StateValue } from './types'
import policyEvaluation from './policyEvaluation'
import policyImprovement from './policyImprovement'
import { isDeepStrictEqual } from 'util'

export default function policyIteration(env: FrozenLakeEnv, gamma=1, theta=1e-8): [ Policy, StateValue ] {
  let policy = ones<number[]>([
    env.nStates, 
    env.nActions]).map(row => 
    row.map(val => val / env.nActions)
  )
  let V: StateValue

  while (true) {
    V = policyEvaluation(env, policy, gamma, theta)
    const improvedPolicy = policyImprovement(env, V, gamma)

    if (isDeepStrictEqual(policy, improvedPolicy)) break

    policy = clone(improvedPolicy)
  }

  return [ policy, V ]
}
