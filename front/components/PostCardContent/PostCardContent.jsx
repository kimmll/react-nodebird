import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Input, Button } from 'antd'
import { useSelector } from 'react-redux';

const { TextArea } = Input

const PostCardContent = ({ postData, editMode, onCancelUpdatePost, onChangePost }) => {
    const [editText, setEditText] = useState(postData)
    const { updatePostLoading, updatePostDone } = useSelector(state => state.post)

    useEffect( () => {
        if(updatePostDone) {
            onCancelUpdatePost()
        }
    },[updatePostDone])

    const onChangeText = useCallback( e => {
        setEditText(e.target.value)
    },[])

    return(
        <div>
            {editMode 
            ? (
                <>
                    <TextArea value={editText} onChange={onChangeText}/>
                    <Button.Group>
                            <Button loading={updatePostLoading} onClick={onChangePost(editText)}>수정</Button> {/* 수정버튼 활성화 -> 리트윗 게시글이 아닐경우*/}
                            <Button type='danger' onClick={onCancelUpdatePost}>취소</Button> {/* 삭제버튼 활성화 */}
                    </Button.Group>
                </>
            )
            : postData.split(/(#[^\s#]+)/g).map((v, i) => {
                if (v.match(/(#[^\s#]+)/g)) {
                    return <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}><a>{v}</a></Link>
                }
                return v
            })}
        </div>
    )
}


PostCardContent.propTypes= {
    postData : PropTypes.string.isRequired,
    editMode : PropTypes.bool,
    onChangePost : PropTypes.func.isRequired,
    onCancelUpdatePost : PropTypes.func.isRequired,
}

PostCardContent.defaultProps = {
    editMode : false,
}

export default PostCardContent;