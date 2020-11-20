import GridWorld, { Position, Action, Transition, MDP } from './GridWorldEnv'
import { fill } from "../utils/lists"

type Tile = 'S' | 'F' | 'H' | 'G'
type LakeMap = Tile[][]
type LakeMapDict = { [size: string]: LakeMap }

export default class FrozenLakeEnv extends GridWorld<LakeMap, Tile> {

  static MAPS: LakeMapDict = {
    '4x4': [
      ['S', 'F', 'F', 'F'],
      ['F', 'H', 'F', 'H'],
      ['F', 'F', 'F', 'H'],
      ['H', 'F', 'F', 'G']
    ],
    '8x8': [
      ['S', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
      ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
      ['F', 'F', 'F', 'H', 'F', 'F', 'F', 'F'],
      ['F', 'F', 'F', 'F', 'F', 'H', 'F', 'F'],
      ['F', 'F', 'F', 'H', 'F', 'F', 'F', 'F'],
      ['F', 'H', 'H', 'F', 'F', 'F', 'H', 'F'],
      ['F', 'H', 'F', 'F', 'H', 'F', 'H', 'F'],
      ['F', 'F', 'F', 'H', 'F', 'F', 'F', 'G']
    ]
  }

  static generateLake(size: Size, probFrozen: number): LakeMap {
    // TODO: implement a random generator
    return FrozenLakeEnv.MAPS['4x4']
  }

  constructor(size: Size = [4, 4], is_slippery = true, probFrozen = 0.8) {
    super(size)
    this.grid = FrozenLakeEnv.generateLake(size, probFrozen)
    this.nStates = size[0] * size[1]

    this.computeDynamics(is_slippery)
  }

  protected calcReward(tile: Tile): number {
    return Number(tile === 'G')
  }

  protected calcDone(tile: Tile): Done {
    return ['H', 'G'].includes(tile)
  }

  protected computeDynamics(is_slippery: boolean): MDP {
    const dynamics = super.computeDynamics()
    const { size, nActions } = this
    
    for(let row = 0; row < size[0]; row++){
      for(let col = 0; col < size[1]; col++){

        const position = [row, col] as Position
        const state = this.toState(position)

        for(let action = 0; action < nActions; action++) {
          dynamics[state][action] = dynamics[state][action] || []
          
          const tile = this.getTile(position)

          if (['H', 'G'].includes(tile)) {

            dynamics[state][action].push({
              prob: 1.0,
              nextState: state,
              reward: 0,
              done: true,
            })

          } else if (is_slippery) {

            // Floor is slippery, this means that two other
            // actions could happen if you take a step in a
            // direction. E.g.
            //   Intended direction: up (or down)
            //   Unintended outcome: left or right
            //
            //   Intended direction: right (or left)
            //   Unintended outcome: up or down
            const potential_actions = [
              (action - 1) % nActions, // unintended
              action, // intended
              (action + 1) % nActions, // unintended
            ]
            const n_all = potential_actions.length

            for(let a of potential_actions) {
              const transition = this.getTransition(position, a)
              transition.prob = 1/n_all // uniform probs
              dynamics[state][action].push(transition)
            }

          } else {
            const transition = this.getTransition(position, action)
            dynamics[state][action].push(transition)
          }
        }
      }
    }

    return dynamics
  }
}
