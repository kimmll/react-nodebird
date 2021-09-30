import { createWrapper } from 'next-redux-wrapper'
import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from '../reducers/index'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'

const loggerMiddleware = ( { dispatch, getState }) => next => action => {
    return next(action)
}

const configureStore = () => {
    
    const sagaMiddleware = createSagaMiddleware()
    const middlewares = [sagaMiddleware, loggerMiddleware]
    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : composeWithDevTools(
        applyMiddleware(...middlewares)
    )
    const store = createStore(reducer, enhancer)
    store.sagaTask =sagaMiddleware.run(rootSaga)
    return store
}

const wrapper = createWrapper(configureStore, {
    debug : process.env.NODE_ENV === 'development' // 옵션 디버그를 true로 설정
})

export default wrapper