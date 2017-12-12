import test from 'ava'

import * as selectors from '../../../../src/redux/modules/validation/selectors'

test('getErrors', (t) => {
  const selector = selectors.getErrors

  t.deepEqual(
    selector({ validation: {} }, 'someKey'),
    {}
  )
  t.deepEqual(
    selector({ validation: { someKey: 'hi' } }, 'someKey'),
    'hi'
  )
  t.deepEqual(
    selector({ validation: { someKey: {} } }, 'someKey'),
    {}
  )
  t.deepEqual(
    selector({ validation: { someOtherKey: {} } }, 'someKey'),
    {}
  )
  t.deepEqual(
    selector({ validation: { someKey: { someField: 'yes' } } }, 'someKey'),
    { someField: 'yes' }
  )
})
