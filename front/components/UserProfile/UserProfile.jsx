import React, { useCallback } from 'react';
import { Card, Avatar } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { logoutRequestAction } from '../../reducers/user'
import UserPorfileButton from '../UserProfileButton/UserPorfileButton'
import Link from 'next/link'

const UserProfile = () => {
    const dispatch = useDispatch()
    const {me} = useSelector( state => state.user)

    const onLogout = useCallback( () => { // 로그아웃 버튼 클릭시
        dispatch(logoutRequestAction())
    },[])

    return(
        <>
            <Card actions = {[
                <div key='twit'><Link href={`/user/${me.id}`}><a>트윗<br/>{me.Posts.length}</a></Link></div>, // 내가 적은 트윗의 갯수
                <div key='followings'><Link href={'/profile'}><a>팔로잉<br/>{me.Followings.length}</a></Link> {/* 내가 팔로우 하고 있는 수 */}
                </div>,
                <div key='followers'><Link href={'/profile'}><a>팔로워<br/>{me.Followers.length}</a></Link></div>
            ]}>
                <Card.Meta avatar={(
                    <Link href={`/user/${me.id}`}  prefetch ={false} >
                        <a><Avatar >{me.nickname[0]}</Avatar></a>
                    </Link>
                )}
                 title={me.nickname}/>
                <UserPorfileButton onLogout={onLogout} />
            </Card>
        </>
    )
}

export default UserProfile;