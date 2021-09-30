import React, { useCallback, useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import useInput from '../../hooks/useInput'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styles from './CommentForm.module.css'
import { ADD_COMMENT_REQUEST } from '../../reducers/post'
import { useDispatch } from 'react-redux'
 
const CommentForm = ({post}) => {

    const dispatch = useDispatch()

    const id = useSelector( (state) => state.user.me?.id)
    const { addCommentDone, addCommentLoading } = useSelector( state => state.post)

    const[commentText, onChangeCommentText, setCommnetText] = useInput('')

    useEffect( () => {
        if(addCommentDone) {
            setCommnetText('')
        }
    }, [addCommentDone])

    const onSubmitComment = useCallback( () => {
        console.log(post.id, commentText, id)
        dispatch({
            type : ADD_COMMENT_REQUEST,
            data : { content : commentText, postId : post.id, userId : id}
        })
    }, [commentText, id])
    return(
        <Form onFinish={onSubmitComment}>
            <Form.Item className={styles.form}>
                <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
                <Button className={styles.button} type='primary' htmlType='submit' loading={addCommentLoading}>삐약</Button>
            </Form.Item>
        </Form>
    )
} 

CommentForm.propTypes = {
    post: PropTypes.object.isRequired,
}

export default CommentForm;