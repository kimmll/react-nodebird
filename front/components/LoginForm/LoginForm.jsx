/*
    초기 로그인 화면
    AppLayout에서 로그인이 되어 있지 않았을 경우 보여지는 컴포넌트
*/

import React, { useCallback, useEffect, useState } from 'react';
import styles from './LoginForm.module.css'
import { Form, Input, Button } from 'antd'
import Link from 'next/link'
import { useDispatch } from 'react-redux';
import { loginRequestAction } from '../../reducers/user.js'
import { useSelector } from 'react-redux';
import useInput from '../../hooks/useInput';

const LoginForm = () => {

    const dispatch = useDispatch()
    const { logInLoading, logInError } = useSelector( state => state.user) // user 리듀서에서 해당 값만 선택

    useEffect( () => {
        if(logInError) {
            alert(logInError)
        }
    }, [logInError])

    const [email, onChangeEmail] = useInput('') // email 입력시 useInput 커스텀훅을 통해 쓰여지는 값과 값을 업데이트하는 함수를 리턴받음 

    const [password, setPassword] = useState('') // password state
    const onChangePassword = useCallback( (e) => { // password 입력란에 password 입력시
        setPassword(e.target.value) // password 값을 업데이트
    },[])

    const onSubmit = useCallback( () => { // 로그인 버튼을 눌렀을 때
        console.log(email, password)
        dispatch(loginRequestAction({ email, password })) // loginRequestAction을 호출 -> 실제 로그인에 사용된 이메일, 패스워드를 매개변수로 전달
    },[email, password])

    return (
        <Form className={styles.form} onFinish={onSubmit}>
            <div>
                <label htmlFor='userEmail'>이메일</label>
                <br />
                <Input value={email} type='email' name='userEmail' onChange={onChangeEmail} required />
            </div>
            <div>
                <label htmlFor='userPassword'>비밀번호</label> 
                <br />
                <Input value={password} name='userPassword' type='password' onChange={onChangePassword} required />
            </div>
            <Button className={styles.button} type='primary' htmlType='submit' loading={logInLoading}>로그인</Button>
            <Link href='/signup'><a><Button className={styles.button}>회원가입</Button></a></Link> {/* 회원가입 버튼 클릭시 회원가입 화면으로 이동 */}
        </Form>
    )
}

export default LoginForm;