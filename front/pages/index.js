import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga'
import AppLayout from '../components/AppLayout/AppLayout';
import PostCard from '../components/PostCard/PostCard';
import PostForm from '../components/PostForm/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user'
import wrapper from '../store/configureStore'

const Index = () => {
    const dispatch = useDispatch()
    const { me } = useSelector( (state) => state.user ) // user reducer에서 me 데이터를 가져옴(구조분해)
    const { mainPosts, hasMorePost, loadPostsLoading, retweetError } = useSelector( (state) => state.post)

    useEffect( () => {
        if(retweetError) {
            alert(retweetError)
        }
    }, [retweetError])
    
    useEffect( () => { // 무한스크롤 구현
        function onScroll () {
            if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight-300 ) {
                if(hasMorePost && !loadPostsLoading) {
                    const lastId = mainPosts[mainPosts.length -1]?.id
                    dispatch({
                        type : LOAD_POSTS_REQUEST,
                        lastId 
                    })
                }
            }
        } // scrollY : 얼마나 내렸는지, clientHeight : 화면 보이는 길이, scrollHeight : 총 길이
        window.addEventListener('scroll', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [hasMorePost, loadPostsLoading, mainPosts])

    return(
        <AppLayout>
            {me && <PostForm />} {/* 로그인 정보가 있으면 트윗창 보여줌 */}
            {mainPosts.map((post) => <PostCard key={post.id} post={post} />)} {/* 오른쪽 트윗 화면 */}
        </AppLayout>
    )
}

/* 프론트서버에서 실행되는 부분이기에 브라우저가 개입할 수 없음 */
export const getServerSideProps = wrapper.getServerSideProps(async (context) => { // Home보다 먼저 실행됨
    const cookie = context.req ? context.req.headers.cookie : ''
    axios.defaults.headers.Cookie = ''
    if(context.req && cookie) {
        axios.defaults.headers.Cookie = cookie
    }
    context.store.dispatch({
        type : LOAD_MY_INFO_REQUEST,
    })
    context.store.dispatch({
        type : LOAD_POSTS_REQUEST,
    })
    context.store.dispatch(END)
    await context.store.sagaTask.toPromise()
})

export default Index;