/*
    PostCard 컴포넌트에서 post 정보를 props로 전달받음
    사용자가 로그인 되어 있을 경우 각 게시글에 팔로우/언팔로우 버튼을 보여주는 역할
*/

import React, { useCallback } from 'react';
import PropTypes from 'prop-types'
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../../reducers/user';

const FollowButton = ({post}) => {
    const dispatch = useDispatch()
    const {me, followLoading, unfollowLoading} = useSelector(state => state.user)
    const isFollowing = me?.Followings.find(v => v.id === post.User.id) 

    const onClickButton = useCallback( () => { // 언팔로우, 팔로우 버튼 클릭시
        if(isFollowing) { // 내 팔로잉 목록에 게시글 작성자(유저)가 있을 경우
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: post.User.id
            })
        } else {
            dispatch({
                type: FOLLOW_REQUEST,
                data: post.User.id
            })
        }
    }, [isFollowing])

    if(post.User.id === me.id) { // 게시글 작성자와 로그인된 사용자가 같다면
        return null
    }
    
    return (
        <Button loading={ followLoading || unfollowLoading} onClick={onClickButton}> {/* loading 정보 */}
            {isFollowing ? '언팔로우' : '팔로우'} {/* 내 팔로잉 목록에 게시글작성자가 있을 경우 언팔로우 아닐 경우 팔로우로 버튼명 출력 */}
        </Button>
    )
}

FollowButton.propTypes = {
    post : PropTypes.object.isRequired
}

export default FollowButton;