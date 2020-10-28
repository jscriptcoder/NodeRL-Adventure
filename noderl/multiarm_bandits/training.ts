import * as tf from '@tensorflow/tfjs-node'
import BanditEnv from '../environments/BanditEnv'
import GreedyAgent from './GreedyAgent'
import EpsilonGreegyAgent from './EpsilonGreegyAgent'
import ThomsonSamplingAgent from './ThomsonSamplingAgent'
import UCB1Agent from './UCB1Agent'
import { LOG_PATH } from '../config'
import { full } from '../utils/lists'

const PROB_DIST = [0.2, 0.5, 0.75, 0.15, 0.01, 0.92, 0.88, 0.36, 0.79, 0.9]
const N = PROB_DIST.length
const REWARD_DIST = full(N, 1)
const INIT_VALUE = 0
const EPSILON = 0.01
const EPISODES = 100000

const { log } = console

const env = new BanditEnv(PROB_DIST, REWARD_DIST)
// const agent = new GreedyAgent(N, INIT_VALUE)
// const agent = new EpsilonGreegyAgent(N, EPSILON, INIT_VALUE)
// const agent = new UCB1Agent(N, INIT_VALUE)
const agent = new ThomsonSamplingAgent(N, INIT_VALUE)

const writer = tf.node.summaryFileWriter(`${LOG_PATH}/${agent.name}`)

let total_reward = 0

if (agent instanceof UCB1Agent) {
  // Initialization. We try once all the arms
  for (let i = 0; i < N; i++) {
    const action = agent.pull(i)
    const reward = env.step(action)
    agent.optimize(action, reward)
  }
}

for (let e = 0; e < EPISODES; e++) {
  const action = agent.act()
  const reward = env.step(action)

  total_reward += reward

  agent.optimize(action, reward)

  writer.scalar('Reward', reward, e)
}

log('Mean estimates:\n', agent.estimates)
log(`Total reward: ${total_reward}`)
log(`Win rate: ${total_reward/EPISODES}`)
log('Times arms were pulled:', agent.counts)

if (agent instanceof EpsilonGreegyAgent) {
  log('Exploration/Exploitation rate:', agent.explore_exploit_rate())
}
