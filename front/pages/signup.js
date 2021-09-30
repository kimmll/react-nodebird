import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout/AppLayout';
import axios from 'axios'
import { END } from 'redux-saga'
import Head from 'next/head'
import { Form, Input, Checkbox, Button } from 'antd';
import styles from './pages.module.css'
import useInput from '../hooks/useInput'
import { SIGN_UP_REQUEST } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user'
import wrapper from '../store/configureStore'

const Signup = () => {

    const dispatch = useDispatch()
    const { singUpLoading, signUpDone, signUpError, me } = useSelector(state => state.user)

    useEffect( () => {
        if(me && me.id) {
            Router.replace('/') // push vs replace 차이
        }
    }, [me && me.id])


    useEffect( () => { // 회원가입 완료 후 메인페이지로
        if(signUpDone) {
            alert('축하드립니다. 회원가입이 완료되었습니다.')
            Router.replace('/')
        }
    }, [signUpDone])
    
    useEffect( () => {
        if(signUpError) {
            alert(signUpError)
        }
    }, [signUpError])

    const [email, onChangeEmail] = useInput('') // id state
    const [password, onChangePassword] = useInput('') // password state
    const [nickname, onChangeNickname] = useInput('') // nickname state
0
    const [passwordCheck, setPasswordCheck] = useState('') // passwordCheck state
    const [passwordError, setPasswordError] = useState(false) // passwordError state

    const onChangePasswordCheck = useCallback ( (e) => { // passwordCheck 입력 함수
        setPasswordCheck(e.target.value) // passwordCheck state 업데이트
        console.log('check',passwordCheck)
        setPasswordError(e.target.value !== password) // 비밀번호와 비밀번호확인이 다를 경우 passwordError를 true로 업데이트
    },[password])

    const [term, setTerm] = useState('') // checkbox 체크 여부 확인 state
    const [termError, setTermError] = useState(false) // 체크 에러 확인 state

    const onChangeTerm = useCallback ((e) => { // 체크 함수
        setTerm(e.target.checked) // 체크되면 term 업데이트
        setTermError(false) // termError flase로 업데이트
    }, [])

    const onFinish = useCallback( () => {
        if(password !== passwordCheck) {
            console.log(password)
            console.log(passwordCheck)
            return setPasswordError(true)
        }
        if(!term) {
            return setTermError(true)
        }
        console.log(email, password, nickname)
        dispatch({
            type : SIGN_UP_REQUEST,
            data : { email, password, nickname}
        })
    },[email, password, passwordCheck, term])

    return (
        <AppLayout>
            <Head>
                <title>회원가입 | NodeBird</title>
            </Head>
            <Form onFinish={onFinish}>
                <div>
                    <label htmlFor='userEmail'>이메일</label>
                    <br/>
                    <Input name='userEmail' value={email} type='email' required onChange={onChangeEmail} />
                </div>
                <div>
                    <label htmlFor='userNickname'>닉네임</label>
                    <br/>
                    <Input name='userNickname' value={nickname} required onChange={onChangeNickname} />
                </div>
                <div>
                    <label htmlFor='userPassword'>비밀번호</label>
                    <br/>
                    <Input name='userPassword' type='password' value={password} required onChange={onChangePassword} />
                </div>
                <div>
                    <label htmlFor='userPasswordCheck'>비밀번호 확인</label>
                    <br/>
                    <Input name='userPasswordCheck' type='password' value={passwordCheck} required onChange={onChangePasswordCheck} />
                    { passwordError && <div className={styles.error}>비밀번호가 일치하지 않습니다.</div> }
                </div>
                <div>
                    <Checkbox name='userTerm' checked={term} onChange={onChangeTerm}>약관에 동의합니다.</Checkbox>
                    {termError && <div className={styles.error}>약관에 동의하셔야 합니다.</div>}
                </div>
                <div className={styles.permission}>
                    <Button type='primary' htmlType='submit' loading={singUpLoading}>가입하기</Button>
                </div>
            </Form>
        </AppLayout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) =>{ // Home보다 먼저 실행됨
    const cookie = context.req ? context.req.headers.cookie : ''
    axios.defaults.headers.Cookie = ''
    if(context.req && cookie) {
        axios.defaults.headers.Cookie = cookie
    }
    context.store.dispatch({
        type : LOAD_MY_INFO_REQUEST,
    })
    context.store.dispatch(END)
    await context.store.sagaTask.toPromise()
})

export default Signup;