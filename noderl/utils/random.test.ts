import test from 'tape'
import { randint, choice } from './random'

test('random.randint', t => {
  const rnd5 = randint(5)
  const rnd3_5 = randint(3, 5)

  t.ok(rnd5 >= 0 && rnd5 < 5, 'Rand int [0, 5)')
  t.ok(rnd3_5 >= 3 && rnd3_5 < 5, 'Rand int [3, 5)')

  t.throws(() => randint(-1) , 'Throws -1 >= 0')
  t.throws(() => randint(6, 2) , 'Throws 2 >= 6')

  t.end()
})

test('random.choice', t => {
  const list = ['a', 'b', 'c', 'd']
  const rnd = choice(list)
  t.ok(list.includes(rnd), `Rand value "${rnd}" is in list`)
  t.end()
})
