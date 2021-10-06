import {all, fork} from 'redux-saga/effects'
import postSaga from './post'
import userSaga from './user'
import axios from 'axios'
import { backUrl } from '../config/config.js'

axios.defaults.baseURL = backUrl
axios.defaults.withCredentials = true

export default function* rootSaga() {
    yield all([ // 배열을 받아서 배열안에 있는 것들을 실행(동시에)
        fork(postSaga), // fork는 함수를 실행 <-> call과 차이가 있음 , fork, call 은 제너레이터 함수를 실행
        fork(userSaga),
    ])
}