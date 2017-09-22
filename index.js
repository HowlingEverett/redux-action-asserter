import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'

export default class ActionAsserter {
  constructor () {
    this.reset()
  }

  middleware () {
    return store => next => action => {
      if (isFunction(action)) {
        this.thunks.push(action)
      } else {
        this.actions.push(action)
      }
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
    return this.actions.find((dispatchedAction) => isEqual(action, dispatchedAction)) !== undefined
  }

  resolve () {
    return Promise.all(this.thunks)
  }
}
