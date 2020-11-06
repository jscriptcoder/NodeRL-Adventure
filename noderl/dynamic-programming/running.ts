import { print } from '@tensorflow/tfjs-node'
import FrozenLakeEnv from '../environments/FrozenLakeEnv'
import { ones } from '../utils/lists'
import policyEvaluation from './policyEvaluation'
import { Policy } from './types'


const env = new FrozenLakeEnv()
const random_policy: Policy = ones<number[]>([
  env.nStates, 
  env.nActions
]).map(row => 
  row.map(val => val / env.nActions)
)

const V = policyEvaluation(env, random_policy)

console.log(V)
