type Dict<T> = {[key: string]: T}
type Size = number[]
type Probability = number
type Reward = number
type Done = boolean
type Info = Dict<any>

interface Space {
  name: string
}

interface Discrete extends Space {
  name: 'Discrete'
  n: number
}

interface Continuous extends  Space {
  name: 'Continuous'
  shape: Size
  low: number[]
  high: number[]
  
}

type State<T> = T extends Continuous ? number[] : number
type DiscreteState = State<Discrete>
type ContinuousState = State<Continuous>

type Action<T> = T extends Continuous ? number[] : number
type DiscreteAction = Action<Discrete>
type ContinuousAction = Action<Continuous>
