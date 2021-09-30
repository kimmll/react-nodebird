import { all, put, takeLatest, fork, throttle, call } from "redux-saga/effects";
import axios from 'axios'
import {
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
    UPDATE_POST_REQUEST, UPDATE_POST_SUCCESS, UPDATE_POST_FAILURE,
    LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE, 
    LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
    LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
    UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
    UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE,
    RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE,
    LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE,
    LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
} from '../reducers/post'
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user'

function retweetAPI(data) {
    return axios.post(`/post/${data}/retweet`) // data에 게시글이 들어가있음
} // foramData는 {} 감싸면 json이 되기 때문에 {} 사용하면 안됨

function* retweet(action) {
    try {
        const result = yield call(retweetAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : RETWEET_SUCCESS,
            data : result.data // 백엔드서버에서 넘어온 데이터
        })
    } catch(err) {
        yield put ({
            type : RETWEET_FAILURE,
            error : err.response.data
        })
    }
}

function uploadImagesAPI(data) {
    return axios.post(`/post/images`, data) // data에 게시글이 들어가있음
} // foramData는 {} 감싸면 json이 되기 때문에 {} 사용하면 안됨

function* uploadImages(action) {
    try {
        const result = yield call(uploadImagesAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : UPLOAD_IMAGES_SUCCESS,
            data : result.data // 백엔드서버에서 넘어온 데이터
        })
    } catch(err) {
        yield put ({
            type : UPLOAD_IMAGES_FAILURE,
            error : err.response.data
        })
    }
}

function likePostAPI(data) {
    return axios.patch(`/post/${data}/like`) // data에 게시글이 들어가있음
}

function* likePost(action) {
    try {
        const result = yield call(likePostAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : LIKE_POST_SUCCESS,
            data : result.data // 백엔드서버에서 넘어온 데이터
        })
    } catch(err) {
        yield put ({
            type : LIKE_POST_FAILURE,
            error : err.response.data
        })
    }
}

function unlikePostAPI(data) {
    return axios.delete(`/post/${data}/like`) // data에 게시글이 들어가있음
}

function* unlikePost(action) {
    try {
        const result = yield call(unlikePostAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : UNLIKE_POST_SUCCESS,
            data : result.data // 백엔드서버에서 넘어온 데이터
        })
    } catch(err) {
        yield put ({
            type : UNLIKE_POST_FAILURE,
            error : err.response.data
        })
    }
}

function addPostAPI(data) {
    return axios.post('/post', data) // data에 게시글이 들어가있음, fromdata는 {} 감싸면 안됨
}

function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : ADD_POST_SUCCESS,
            data : result.data // 백엔드서버에서 넘어온 데이터
        })
        yield put ({
            type: ADD_POST_TO_ME,
            data: result.data.id,
        })
    } catch(err) {
        yield put ({
            type : ADD_POST_FAILURE,
            error : err.response.data
        })
    }
}

function loadPostAPI(data) {
    return axios.get(`/post/${data}`) // get에 데이터를 보낼때 쿼리스트링 방식으로 키 = 값
}

function* loadPost(action) {
    try {
        const result = yield call(loadPostAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : LOAD_POST_SUCCESS,
            data : result.data
        })
    } catch(err) {
        console.error(err)
        yield put ({
            type : LOAD_POST_FAILURE,
            error : err.response.data
        })
    }
}

function loadHashtagPostsAPI(data, lastId) {
    return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`) // get에 데이터를 보낼때 쿼리스트링 방식으로 키 = 값
}

function* loadHashtagPosts(action) {
    try {
        const result = yield call(loadHashtagPostsAPI, action.data, action.lastId) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        console.log('해시태그 검색 결과 값은 ????? ', result)
        yield put ({
            type : LOAD_HASHTAG_POSTS_SUCCESS,
            data : result.data
        })
    } catch(err) {
        console.error(err)
        yield put ({
            type : LOAD_HASHTAG_POSTS_FAILURE,
            error : err.response.data
        })
    }
}

function loadUserPostsAPI(data, lastId) {
    return axios.get(`/user/${data}/posts?lastId=${lastId || 0} `) // get에 데이터를 보낼때 쿼리스트링 방식으로 키 = 값
}

function* loadUserPosts(action) {
    try {
        console.log('니 요청은 ', action.data)
        const result = yield call(loadUserPostsAPI, action.data, action.lastId) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : LOAD_USER_POSTS_SUCCESS,
            data : result.data
        })
    } catch(err) {
        console.error(err)
        yield put ({
            type : LOAD_USER_POSTS_FAILURE,
            error : err.response.data
        })
    }
}

function loadPostsAPI(lastId) {
    return axios.get(`/posts?lastId=${lastId || 0}`) // get에 데이터를 보낼때 쿼리스트링 방식으로 키 = 값
}

function* loadPosts(action) {
    try {
        const result = yield call(loadPostsAPI, action.lastId) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : LOAD_POSTS_SUCCESS,
            data : result.data
        })
    } catch(err) {
        console.error(err)
        yield put ({
            type : LOAD_POSTS_FAILURE,
            error : err.response.data
        })
    }
}

function updatePostAPI(data) {
    return axios.patch(`/post/${data.PostId}` , data)
}

function* updatePost(action) {
    try {
        const result = yield call(updatePostAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : UPDATE_POST_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : UPDATE_POST_FAILURE,
            error : err.response.data
        })
    }
}

function removePostAPI(data) {
    return axios.delete(`/post/${data}`)
}

function* removePost(action) {
    try {
        const result = yield call(removePostAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : REMOVE_POST_SUCCESS,
            data : result.data
        })
        yield put ({
            type: REMOVE_POST_OF_ME,
            data: action.data,
        })
    } catch(err) {
        yield put ({
            type : REMOVE_POST_FAILURE,
            error : err.response.data
        })
    }
}

function addCommnetAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, data)
}

function* addComment(action) {
    try {
        const result = yield call(addCommnetAPI, action.data) // fork는 비동기 함수 호출(nonblocking) call은 동기 -> 결과값이 올때까지 기다리느냐 다음줄로 넘어가느냐 차이
        yield put ({
            type : ADD_COMMENT_SUCCESS,
            data : result.data
        })
    } catch(err) {
        yield put ({
            type : ADD_COMMENT_FAILURE,
            error : err.response.data
        })
    }
}

function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet)
}


function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages)
}

function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost)
}

function* watchUnlikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost)
}

function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost)
}

function* watchLoadPost() {
    yield takeLatest(LOAD_POST_REQUEST, loadPost)
}

function* watchLoadUserPosts() {
    yield throttle(2000, LOAD_USER_POSTS_REQUEST, loadUserPosts)
}

function* watchLoadHashtagPosts() {
    yield throttle(2000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts)
}

function* watchLoadPosts() {
    yield throttle(2000, LOAD_POSTS_REQUEST, loadPosts)
}

function* watchUpdatePost() {
    yield takeLatest(UPDATE_POST_REQUEST, updatePost)
}

function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost)
}

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment)
}

export default function* postSaga() {
    yield all([
        fork(watchRetweet),
        fork(watchUploadImages),
        fork(watchLikePost),
        fork(watchUnlikePost),
        fork(watchAddPost),
        fork(watchLoadPost),
        fork(watchLoadUserPosts),
        fork(watchLoadHashtagPosts),
        fork(watchLoadPosts),
        fork(watchUpdatePost),
        fork(watchRemovePost),
        fork(watchAddComment),
    ])
}