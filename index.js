import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'

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
    return this.actions.find((dispatchedAction) => {
      for (const key in dispatchedAction) {
        if (dispatchedAction.hasOwnProperty(key) && action.hasOwnProperty(key)) {
          if (!isEqual(dispatchedAction[key], action[key])) {
            return false
          }
        }
      }
      return true
    }) !== undefined
  }

  dispatchedExactAction (action) {
    return this.actions.find((dispatchedAction) => isEqual(action, dispatchedAction)) !== undefined
  }

  resolve () {
    return Promise.all(this.thunks)
  }
}
