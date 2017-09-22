import {describe, it} from 'mocha'
import assert from 'assert'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'

import ActionAsserter from '../'

const noopReducer = (state) => state

describe('Action asserter test middleware for redux', () => {
  it('should hold onto a map of actions dispatched by the store', () => {
    const actionAsserter = new ActionAsserter()
    const store = createStore(noopReducer, applyMiddleware(actionAsserter.middleware()))

    const firstAction = {type: 'one'}
    const secondAction = {type: 'two', prop: 'some-property'}

    store.dispatch(firstAction)
    store.dispatch(secondAction)

    assert.deepEqual(actionAsserter.getActions(), [firstAction, secondAction])

    const thirdAction = {type: 'two'}
    store.dispatch(thirdAction)

    assert.deepEqual(actionAsserter.getActions(), [firstAction, secondAction, thirdAction])
  })

  it('should provide a thennable hook for any dispatched actions that are promises', () => {
    const actionAsserter = new ActionAsserter()
    const store = createStore(noopReducer, applyMiddleware(thunk, actionAsserter.middleware()))

    const syncAction = {type: 'one'}
    const afterAsyncAction = {type: 'two'}

    const myThunk = () => dispatch => {
      return Promise.resolve().then(() => {
        dispatch(afterAsyncAction)
      })
    }

    store.dispatch(syncAction)
    store.dispatch(myThunk())

    assert.deepEqual(actionAsserter.getActions(), [syncAction])

    return actionAsserter.resolve(() => {
      assert.deepEqual(actionAsserter.getActions(), [syncAction, afterAsyncAction])
    })
  })

  it('should provide a convenience check for if a particular action config has fired', () => {
    const actionAsserter = new ActionAsserter()
    const store = createStore(noopReducer, applyMiddleware(actionAsserter.middleware()))

    const firstAction = {type: 'one'}
    const secondAction = {type: 'two'}

    store.dispatch(firstAction)

    assert(actionAsserter.dispatchedAction(firstAction) === true)
    assert(actionAsserter.dispatchedAction(secondAction) === false)

    store.dispatch(secondAction)

    assert(actionAsserter.dispatchedAction(secondAction) === true)
  })
})
