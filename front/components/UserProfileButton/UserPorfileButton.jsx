import React, { useCallback, useState } from 'react'
import { Button, Modal, Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import useInput from '../../hooks/useInput'
import { CHANGE_NICKNAME_REQUEST } from '../../reducers/user'
import styles from './UserProfileButton.module.css'

const UserPorfileButton = ({ onLogout }) => {
    const {logOutLoading, me} = useSelector( state => state.user)
    const [nickname, onChangeNickname] = useInput(me?.nickname || '')
    const [modalOpen, setModalOpen] = useState(false)
    const dispatch = useDispatch()

    const onClick = () => { // modal 오픈
        setModalOpen(!modalOpen)
    }

    const closeModal = () => { // modal 닫기
        setModalOpen(!modalOpen)
    }

    const onSubmit = useCallback( () => {
        dispatch({
            type : CHANGE_NICKNAME_REQUEST,
            data : nickname,
        })
    })
    return(
        <>
            {me.email}
            <div>
                <Button onClick={onClick}>내정보</Button>
                <Button onClick={onLogout} loading={logOutLoading}>로그아웃</Button>
            </div>
            <Modal cancelButtonProps={{style : {display : 'none'}}} title='정보' visible={modalOpen} onOk={closeModal} onCancel={closeModal}>
                <Input placeholder={me.email}
                    className={styles.input}
                    addonBefore='이메일'
                />
                <Input.Search 
                    className={styles.input}
                    value={nickname}
                    onChange={onChangeNickname}
                    addonBefore='닉네임'
                    enterButton='수정'
                    onSearch={onSubmit} 
                />
            </Modal>
        </>
    )
}

UserPorfileButton.propTypes = {
    onLogout : PropTypes.func.isRequired
}

export default UserPorfileButton;