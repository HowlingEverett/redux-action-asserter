# Redux Test Action Log Middleware

## Why Does This Exist?

I found myself using [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) a lot when writing
semi-integrated tests, where I was testing a connected component inside a `react-redux` `Provider`. 
This works great when you're interacting with the store directly, but is less useful when you're
writing tests that set up more than one connected component and want to test their interaction
with at least partial isolation.

The benefit of this middleware is that it lets you use your actual store configuration, updating
state, and re-rendering connected components with new props, but also assert on sync or async
actions.

## Installation

```
npm install redux-test-action-log --save-dev
```

## Usage

While this module provides a redux middleware, it exists as a constructor with a few extra features. This gives you
access to the assertion functions and encapsulates the action log between tests.

```javascript
import {createStore, applyMiddleware} from 'redux'
import ActionAsserter from 'redux-action-asserter'

const actionAsserter = new ActionAsserter()

// Basic no-op test reducer. You would typically use your application reducer her
const myReducer = state => state
const store = createStore(myReducer, applyMiddleware(actionAsserter.middleware()))

// ...Do some stuff that dispatches normal actions
actionAsserter.getActions()
// -> [an, array, of, dispatched, actions]
```

If you're using the [redux-thunk](https://github.com/gaearon/redux-thunk) middleware, you can also use `resolve` to
create a thennable that will resolve when all dispatched thunks have resolved. *Note* to use this feature, your thunk
__must__ return a Promise.

```javascript
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import ActionAsserter from 'redux-action-asserter'

const actionAsserter = new ActionAsserter()

// Basic no-op test reducer. You would typically use your application reducer her
const myReducer = state => state
const store = createStore(myReducer, applyMiddleware(thunk, actionAsserter.middleware()))

const afterAsyncAction = {type: 'after-async'}
const myThunk = () => dispatch => {
  return Promise.resolve().then(() => {
    dispatch(afterAsyncAction)
  })
}
store.dispatch(myThunk())

actionAsserter.resolve().then(() => {
  store.getActions()
  // [afterAsyncAction]
})
```
