import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'
import matches from 'lodash/matches'

export default class ActionAsserter {
  constructor () {
    this.reset()
  }

  middleware () {
    return store => next => action => {
      if (isFunction(action)) {
        return this.thunks.push(action(store.dispatch, store.getState))
      }
      this.actions.push(action)
      return next(action)
    }
  }

  reset () {
    this.actions = []
    this.thunks = []
  }

  getActions () {
    return this.actions
  }

  dispatchedAction (action) {
    return this.actions.find((dispatchedAction) => matches(action, dispatchedAction)) !== undefined
  }

  dispatchedExactAction (action) {
    return this.actions.find((dispatchedAction) => isEqual(action, dispatchedAction)) !== undefined
  }

  resolve () {
    return Promise.all(this.thunks)
  }
}
