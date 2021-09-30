import React, { useCallback } from 'react';
import styles from './NicknameEditForm.module.css'
import { Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from '../../reducers/user';

const NicknameEditForm = () => {
    const { me } = useSelector( state => state.user)
    const [nickname, onChangeNickname] = useInput(me?.nickname || '')
    const dispatch = useDispatch()

    const onSubmit = useCallback( () => {
        dispatch({
            type : CHANGE_NICKNAME_REQUEST,
            data : nickname
        })
    }, [nickname])
    return (
        <Form className={styles.form}>
            <Input.Search value={nickname} 
            onChange={onChangeNickname} 
            addonBefore='닉네임' 
            enterButton='수정'
            onSearch={onSubmit} />
        </Form>
    )
}

export default NicknameEditForm;