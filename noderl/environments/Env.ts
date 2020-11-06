export type Reward = number
export type Done = boolean

export interface Transition<S> {
  nextState: S,
  reward: Reward,
  done: Done,
}

export default interface Env<S, A> {
  step(action: A): Transition<S>
}
