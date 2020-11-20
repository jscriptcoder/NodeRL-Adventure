import { Discrete } from "gymie/dist/Env"

export type Step<S extends Space> = [State<S>, Reward, Done, Info]

export type DiscreteStep = Step<Discrete>
export type ContinuousStep = Step<Continuous>

export interface Transition<S extends Space> {
  nextState: State<S>,
  reward: Reward,
  done: Done,
}

export interface TransitionWithProb<S extends Space> extends Transition<S> {
  prob: Probability
}

export default interface Env<S extends Space, A extends Space> {
  step(action: Action<A>): Step<S>
}

export type DiscreteEnv = Env<Discrete, Discrete>
export type ContinuousEnv = Env<Continuous, Continuous>
