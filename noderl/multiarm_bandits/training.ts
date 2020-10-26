import * as tf from '@tensorflow/tfjs-node'
import BanditEnv from '../environments/BanditEnv'
import GreedyAgent from './GreedyAgent'
import EpsilonGreegyAgent from './EpsilonGreegyAgent'
import UCB1Agent from './UCB1Agent'
import { LOG_PATH } from '../config'

const PROB_DIST = [0.2, 0.5, 0.75]
const REWARD_DIST = [1, 1, 1]
const INIT_VALUE = 10
const EPSILON = 0.01
const EPISODES = 100000

const { log } = console

const env = new BanditEnv(PROB_DIST, REWARD_DIST)
// const agent = new GreedyAgent(PROB_DIST.length, INIT_VALUE)
// const agent = new EpsilonGreegyAgent(PROB_DIST.length, EPSILON, INIT_VALUE)
const agent = new UCB1Agent(PROB_DIST.length, INIT_VALUE)

const writer = tf.node.summaryFileWriter(`${LOG_PATH}/bandits`)

let total_reward = 0

if (agent instanceof UCB1Agent) {
  PROB_DIST.forEach((_, i) => {
    const action = agent.pull(i)
    const reward = env.step(action)
    agent.optimize(action, reward)
  })
}

for (let e = 0; e < EPISODES; e++) {
  const action = agent.act()
  const reward = env.step(action)

  total_reward += reward

  agent.optimize(action, reward)

  writer.scalar('Reward', reward, e)
}

log('Mean estimates:', agent.estimates)
log(`Total reward: ${total_reward}`)
log(`Win rate: ${total_reward/EPISODES}`)
log('Times arms were pulled:', agent.counts)

if (agent instanceof EpsilonGreegyAgent) {
  log('Exploration/Exploitation rate:', agent.explore_exploit_rate())
}
