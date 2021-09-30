/*
    작성한 게시글을 보여주는 컴포넌트
    antd Card를 이용하여 게시글을 화면에 보여줌
*/

import { RetweetOutlined, EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined } from '@ant-design/icons'
import { Card, Popover, Button, Avatar, List, Comment } from 'antd'
import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import moment from 'moment'
import PostImages from '../PostImages/PostImages'
import CommentForm from '../CommentForm/CommentForm'
import PostCardContent from '../PostCardContent/PostCardContent'
import styles from './PostCard.module.css'
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST, UPDATE_POST_REQUEST } from '../../reducers/post'
import FollowButton from '../FollowButton/FollowButton'

moment.locale('ko') // moment 라이브러리. 한글설정

// 배열안에 jsx를 붙여줄 때 항상 key를 넣어줘야함
const PostCard = ({ post }) => {
    const dispatch = useDispatch()
    const { removePostLoading } = useSelector(state => state.post)
    const id = useSelector(state => state.user.me?.id) // user.me에서 id 값을 가져옴
    const liked = post.Likers.find( v => v.id === id) 
    const [commentFormOpened, setCommentFormOpened] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const onLike = useCallback( () => { // 좋아요를 누를 때 호출되는 함수
        if(!id) { // 로그인이 되어 있지 않은 경우
            return alert('로그인이 필요합니다.')
        }
        return dispatch({ // 리듀서 LIKE_POST_REQUEST 요청, 게시글의 id를 넘김
            type : LIKE_POST_REQUEST,
            data : post.id
        })
    })

    const onUnlike = useCallback( () => { // 좋아요 취소
        if(!id) {
            return alert('로그인이 필요합니다.')
        }
        return dispatch({
            type : UNLIKE_POST_REQUEST,
            data : post.id
        })
    })

    const onToggleComment = useCallback( () => { // 댓글입력란을 누를 때 호출되는 함수
        setCommentFormOpened(prev => !prev) // commentFormOpend 값 변경
    })

    const onRemovePost = useCallback( () => { // 게시글 삭제
        if(!id) {
            return alert('로그인이 필요합니다.')
        }
        const deleteConfirm = confirm('게시글을 삭제하시겠습니까?')
        if(deleteConfirm) {
            return dispatch({
                type: REMOVE_POST_REQUEST,
                data: post.id,
            })
        }
        else {
            return
        }
    })

    const onRetweet = useCallback( () => { // 리트윗 아이콘을 누를 때
        if(!id) {
            return alert('로그인이 필요합니다.')
        }
        return dispatch({
            type : RETWEET_REQUEST,
            data : post.id
        })
    }, [id])

    const onClickUpdate = useCallback ( () => { // 수정 버튼 클릭시
        setEditMode(true)
    }, [])

    const onCancelUpdatePost = useCallback ( () => { // 수정 버튼 클릭시
        setEditMode(false)
    }, [])

    const onChangePost = useCallback( editText => () => {
        dispatch({
            type : UPDATE_POST_REQUEST,
            data : {
                PostId : post.id,
                content : editText,
            }
        })
    }, [post])

    return (
        <div className={styles.div} >
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />} // 이미지가 있을 경우 PostImages 컴포넌트에 Images 정보를 props로 넘김 
                actions={ id && [ // 로그인 했을 경우에만 리트윗, 좋아요, 댓글 아이콘이 보이도록 설정
                    <RetweetOutlined key='retweet' onClick={onRetweet}/>, // 리트윗 아이콘
                    liked  // 좋아요가 눌러져 있을 경우
                        ? <HeartTwoTone twoToneColor='#eb2f96' key='heart' onClick={onUnlike}/> // 좋아요 버튼의 색상을 변경
                        : <HeartOutlined key='heart' onClick={onLike}/>, 
                    <MessageOutlined key='comment' onClick={onToggleComment}/>, // 댓글 아이콘
                    <Popover key='more' content={(
                        <Button.Group>
                            {id && post.User.id === id ? ( // 로그인이 되어 있고, 로그인된 사용자가 게시글 작성한 사용자와 같을 경우
                                <>
                                    {!post.RetweetId && <Button onClick={onClickUpdate}>수정</Button> } {/* 수정버튼 활성화 -> 리트윗 게시글이 아닐경우*/}
                                    <Button type='danger' loading={removePostLoading} onClick={onRemovePost}>삭제</Button> {/* 삭제버튼 활성화 */}
                                </>
                            ):  <Button>신고</Button>} {/* 로그인된 사용자가 게시글의 작성자가 아닐 경우 신고버튼만 보이도록 */}
                        </Button.Group>
                    )}>
                        <EllipsisOutlined />
                    </Popover> 
                ]} 
                title = {post.RetweetId ? `${post.User.nickname}님이 리트윗했습니다.` : null} // 게시글이 리트윗 되었을 경우 게시글 상단에 리트윗 메세지 출력
                extra = { id && <FollowButton post={post} />} // 로그인이 되어 있을 경우 FollowButton 컴포넌트에 게시글 정보를 props로 넘김
            >
                {post.RetweetId && post.Retweet // 게시글에 retweetId와 retweet 정보가 있을 경우
                ? (
                    <Card // 카드안에 카드를 만듬
                        cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />} // 리트윗 게시글에 이미지가 잇을 경우 PostImages 컴포넌트에 전달
                    >
                        <span className={styles.moment}>{moment(post.createdAt).format('YYYY.MM.DD')}</span> {/* 작성날짜 표현 */}
                        <Card.Meta
                            avatar={(
                                <Link href={`/user/${post.Retweet.User.id}`}> 
                                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                                </Link>
                            )}
                            title={post.Retweet.User.nickname}
                            description={<PostCardContent postData={post.Retweet.content} onChangePost={onChangePost} onCancelUpdatePost={onCancelUpdatePost}/>}
                        />
                    </Card>
                )
                : ( // 리트윗 정보가 없을 경우 
                    <>
                            <span className={styles.moment}>{moment(post.createdAt).format('YYYY.MM.DD')}</span>
                            <Card.Meta
                                avatar={(
                                    <Link href={`/user/${post.User.id}`}>
                                            <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                                    </Link>
                                )}
                                title={post.User.nickname}
                                description={<PostCardContent editMode={editMode} postData={post.content} onChangePost={onChangePost} onCancelUpdatePost={onCancelUpdatePost} />}
                            />
                    </>
                )}
            </Card>
            {commentFormOpened && ( // 댓글 작성 아이콘을 클릭했을 경우 commentFormOpened = true
                <div>
                    <CommentForm post={post}/> {/* CommentForm 컴포넌트에 post 정보 전달 */}
                    <List 
                        header={`${post.Comments.length}개의 댓글`} // 댓글 개수
                        itemLayout='horizontal'
                        dataSource={post.Comments} 
                        renderItem={(item) => (
                            <li>
                                <Comment
                                    author={item.User.nickname}
                                    avatar={(
                                        <Link href={`/user/${item.User.id}`}>
                                            <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                                        </Link>
                                    )}
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </div>
            )}
        </div>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        id:PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
        Likers : PropTypes.arrayOf(PropTypes.object),
        RetweetId : PropTypes.number,
        Retweet : PropTypes.objectOf(PropTypes.any)
    }).isRequired
}
export default PostCard;