import FrozenLakeEnv from '../environments/FrozenLakeEnv'
import { ones } from '../utils/lists'
import policyEvaluation from './policyEvaluation'
import { Policy } from './types'
import { isDeepStrictEqual } from 'util'
import policyIteration from './policyIteration'

const env = new FrozenLakeEnv()

const random_policy: Policy = ones<number[]>([
  env.nStates, 
  env.nActions
]).map(row => 
  row.map(val => val / env.nActions)
)

const V = policyEvaluation(env, random_policy)

// const [ policy, V ] = policyIteration(env)

// console.log('LEFT, DOWN, RIGHT, UP')
// console.log(policy)

console.log(V)
