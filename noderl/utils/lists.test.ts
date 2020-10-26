import test from 'tape'
import { argmax, range, full, zeros } from './lists'

test('lists.argmax', t => {
  t.ok(argmax([1, 5, 3, 7, 5]) === 3, 'Argmax is 3')
  t.ok(argmax([1, 8, 3, 7, 5]) === 1, 'Argmax is 1')
  t.ok([1, 6].includes(argmax([1, 8, 3, 7, 5, 4, 8, 2])), 'Argmax is one of [1, 6]')
  t.end()
})

test('lists.range', t => {
  t.deepEqual(range(5), [0, 1, 2, 3, 4], 'Correct range(5)')
  t.deepEqual(range(3), [0, 1, 2], 'Correct range(3)')
  t.deepEqual(range(5, 10), [5, 6, 7, 8, 9], 'Correct range(5, 10)')
  t.throws(() => range(-1) , 'Throws negative size')
  t.throws(() => range(5, 2) , 'Throws size 2 > 5')
  t.end()
})

test('lists.full', t => {
  t.deepEqual(full(5, 5), [5, 5, 5, 5, 5], 'Correct full(5, 5)')
  t.deepEqual(full(3, 0), [0, 0, 0], 'Correct full(3, 0)')
  t.throws(() => full(-4, 1), 'Throws invalid array length')
  t.end()
})

test('lists.zeros', t => {
  t.deepEqual(zeros(4), [0, 0, 0, 0], 'zeros(4)')
  t.throws(() => zeros(-4), 'Throws invalid array length')
  t.end()
})
