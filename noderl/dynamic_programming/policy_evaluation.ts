import FrozenLakeEnv, { Transition } from '../environments/FrozenLakeEnv'
import { zeros } from '../utils/lists'

export default function policy_evaluation(env: FrozenLakeEnv, policy: Matrix<number>, gamma=1, theta=1e-8) {
  const Value = zeros(env.n_states)

  for(;;) {
    let delta = 0

    for(let state = 0; state < env.n_states; state++) {
      const vs = Value[state]

      for (let action = 0; action < env.n_actions; action++ ) {
        const action_prob = policy[state][action]

        for (let transition of env.MDP[state][action]) {
          const { prob, next_state, reward } = transition
          Value[state] += action_prob * prob * (reward + (gamma * Value[next_state]))
        }
      }
      
      delta = Math.max(delta, Math.abs(vs - Value[state]))
    }

    if (delta < theta) break
  }
}
