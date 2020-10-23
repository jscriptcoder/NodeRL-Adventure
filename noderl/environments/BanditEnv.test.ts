import test from 'tape'
import BanditEnv from './BanditEnv'

test('new BanditEnv', t => {
  t.throws(() => new BanditEnv([], []), 'Empty probability distribution')
  t.throws(() => new BanditEnv([1], []), 'Empty reward distribution')
  t.throws(() => new BanditEnv([1, 0], [1]), 'Probability and Reward distribution must be the same length')
  t.throws(() => new BanditEnv([-1, 1], [1, 1]), 'All probabilities must be greater or equal to 0')
  t.throws(() => new BanditEnv([0, 2], [1, 1]), 'All probabilities must be less or equal to 1')
  t.doesNotThrow(() => new BanditEnv([0, 1], [1, 1]), 'Bandit environment correctly initialized')
  t.end()
})

test('BanditEnv#pull', t => {
  const probs = [0.2, 0.5, 0.75]
  const rewards = [8, 5, 2.5]
  const bandit = new BanditEnv(probs, rewards)
  
  t.throws(() => bandit.pull(-1), 'Wrong accion passed in')

  rewards.forEach((reward, arm) => {
    let attempts = 0
    while(true) {
      attempts++
      if(bandit.pull(arm) === reward) {
        t.pass(`Arm ${arm} eventually paid off after ${attempts} attempts`)
        break
      }
    }
  })

  t.end()
})
