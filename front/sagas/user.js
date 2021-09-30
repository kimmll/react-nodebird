import { all, fork, put, takeLatest, call } from "redux-saga/effects";
import axios from 'axios'
import {   
    LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
    LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
    SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, 
    FOLLOW_REQUEST, FOLLOW_SUCCESS, FOLLOW_FAILURE,
    UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS, UNFOLLOW_FAILURE,
    LOAD_MY_INFO_REQUEST, LOAD_MY_INFO_SUCCESS, LOAD_MY_INFO_FAILURE,
    LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE,
    CHANGE_NICKNAME_REQUEST, CHANGE_NICKNAME_SUCCESS, CHANGE_NICKNAME_FAILURE,
    LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE,
    LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWINGS_SUCCESS, LOAD_FOLLOWINGS_FAILURE,
    REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE,
} from '../reducers/user'

function removeFollowerAPI(data) {
    return axios.delete(`/user/follower/${data}`)
}

function* removeFollower(action) {
    try {
        const result = yield call(removeFollowerAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이 첫번째 자리 함수 나머지 자리는 매개변수
        yield put ({
            type : REMOVE_FOLLOWER_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : REMOVE_FOLLOWER_FAILURE,
            error : err.response.data
        })
    }
}

function loadFollowersAPI(data) {
    return axios.get('/user/followers', data)
}

function* loadFollowers(action) {
    try {
        const result = yield call(loadFollowersAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이 첫번째 자리 함수 나머지 자리는 매개변수
        yield put ({
            type : LOAD_FOLLOWERS_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : LOAD_FOLLOWERS_FAILURE,
            error : err.response.data
        })
    }
}

function loadFollowingsAPI(data) {
    return axios.get('/user/followings', data)
}

function* loadFollowings(action) {
    try {
        const result = yield call(loadFollowingsAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이 첫번째 자리 함수 나머지 자리는 매개변수
        yield put ({
            type : LOAD_FOLLOWINGS_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : LOAD_FOLLOWINGS_FAILURE,
            error : err.response.data
        })
    }
}

function changeNicknameAPI(data) {
    return axios.patch('/user/nickname', {nickname : data})
}

function* changeNickname(action) {
    try {
        const result = yield call(changeNicknameAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이 첫번째 자리 함수 나머지 자리는 매개변수
        yield put ({
            type : CHANGE_NICKNAME_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : CHANGE_NICKNAME_FAILURE,
            error : err.response.data
        })
    }
}

function followAPI(data) {
    return axios.patch(`/user/${data}/follow`)
}

function* follow(action) {
    try {
        const result = yield call(followAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이 첫번째 자리 함수 나머지 자리는 매개변수
        yield put ({
            type : FOLLOW_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : FOLLOW_FAILURE,
            error : err.response.data
        })
    }
}

function unfollowAPI(data) {
    return axios.delete(`/user/${data}/follow`)
}

function* unfollow(action) {
    try {
        const result = yield call(unfollowAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이 첫번째 자리 함수 나머지 자리는 매개변수
        yield put ({
            type : UNFOLLOW_SUCCESS,
            data : result.data
        })
    } catch(err) {
        console.error(err)
        yield put ({
            type : UNFOLLOW_FAILURE,
            error : err.response.data
        })
    }
}

function loadMyInfoAPI() {
    return axios.get('/user')
}

function* loadMyInfo() {
    try {
        const result = yield call(loadMyInfoAPI) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이 첫번째 자리 함수 나머지 자리는 매개변수
        console.log('sagalogin : ')
        yield put ({
            type : LOAD_MY_INFO_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : LOAD_MY_INFO_FAILURE,
            error : err.response.data
        })
    }
}

function loadUserAPI(data) {
    return axios.get(`/user/${data}`)
}

function* loadUser(action) {
    try {
        const result = yield call(loadUserAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이 첫번째 자리 함수 나머지 자리는 매개변수
        console.log('loadUserData', result.data)
        yield put ({
            type : LOAD_USER_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : LOAD_USER_FAILURE,
            error : err.response.data
        })
    }
}

function logInAPI(data) {
    return axios.post('/user/login', data)
}

function* logIn(action) {
    try {
        const result = yield call(logInAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이 첫번째 자리 함수 나머지 자리는 매개변수
        console.log('sagalogin : ', action.data)
        yield put ({
            type : LOG_IN_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : LOG_IN_FAILURE,
            error : err.response.data
        })
    }
}

function logOutAPI() {
    return axios.post('/user/logout')
}

function* logOut() {
    try {
        yield call(logOutAPI) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : LOG_OUT_SUCCESS,
            //data : result.data
        })
    } catch(err) {
        yield put ({
            type : LOG_OUT_FAILURE,
            error : err.response.data
        })
    }
}

function signUpAPI(data) {
    return axios.post('/user', data) // post, put, patch는 data를 백엔드로 넘길수 있음
}

function* signUp(action) {
    try {
        const result = yield call(signUpAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        console.log(result)
        yield put ({
            type : SIGN_UP_SUCCESS,
        })
    } catch(err) {
        yield put ({
            type : SIGN_UP_FAILURE,
            error : err.response.data
        })
    }
}

function* watchRemoveFollower() {
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower) // yield take 는 한번만 실행되고 사라지는 일회성임
}

function* watchLoadFollowers() {
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers) // yield take 는 한번만 실행되고 사라지는 일회성임
}

function* watchLoadFollowings() {
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings) // yield take 는 한번만 실행되고 사라지는 일회성임
}

function* watchChangeNickname() {
    yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname) // yield take 는 한번만 실행되고 사라지는 일회성임
}

function* watchLoadMyInfo() {
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo) // yield take 는 한번만 실행되고 사라지는 일회성임
}

function* watchLoadUser() {
    yield takeLatest(LOAD_USER_REQUEST, loadUser) // yield take 는 한번만 실행되고 사라지는 일회성임
}

function* watchFollow() {
    yield takeLatest(FOLLOW_REQUEST, follow) // yield take 는 한번만 실행되고 사라지는 일회성임
}

function* watchUnfollow() {
    yield takeLatest(UNFOLLOW_REQUEST, unfollow) // yield take 는 한번만 실행되고 사라지는 일회성임
}

function* watchLogIn() { // 제너레이터 함수
    yield takeLatest(LOG_IN_REQUEST, logIn) // LOG_IN 액션이 들어오면 logIn 제너레이터 함수를 실행
} // while(true) {yield take('LOG_IN_REQUEST', logIn)} -> 동기적으로 동작하지만 takeEvery는 비동기로 동작
// takeLatest는 클릭을 2번했을 때 마지막거만 실행 , takeEvery는 클릭마다 실행됨

function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut) // yield take 는 한번만 실행되고 사라지는 일회성임
}

function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp) // yield take 는 한번만 실행되고 사라지는 일회성임
}

export default function* userSaga() {
    yield all([
        fork(watchRemoveFollower),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchChangeNickname),
        fork(watchLoadMyInfo),
        fork(watchLoadUser),
        fork(watchFollow),
        fork(watchUnfollow),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUp),
    ])
}