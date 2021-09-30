/*
    pages/index.js에서 AppLayout 컴포넌트를 불러옴
    상단 메뉴 구성 화면 ( 홈 , 프로필, 회원가입)
*/

import React, { useCallback } from 'react';
import Link from 'next/link'
import { Menu, Row, Col, Input } from 'antd';
import LoginForm from '../LoginForm/LoginForm';
import Router from 'next/router'
import PropTypes from 'prop-types'
import UserProfile from '../UserProfile/UserProfile';
import { useSelector } from 'react-redux';
import useInput from '../../hooks/useInput';
import styles from './AppLayout.module.css'

const AppLayout = ({ children }) =>{
    const [searchInput, onChangeSearchInput] = useInput('')
    const { me } = useSelector(state => state.user) // 로그인이 되어 있는지 확인하기 위한 상태값
    
    const onSearch = useCallback( () => {
        searchInput ? Router.push(`/hashtag/${searchInput}`) : Router.push('/')
    },[searchInput])
    
    return (
        <div>
            <Menu mode='horizontal'>
                <Menu.Item key='home'>
                    <Link href='/'><a>홈</a></Link>
                </Menu.Item>
                <Menu.Item key='profile'>
                    <Link href='/profile'><a>프로필</a></Link> 
                </Menu.Item>
                <Menu.Item>
                    <Input.Search 
                    className-={styles.input}
                    enterButton 
                    value={searchInput}
                    onChange={onChangeSearchInput}
                    onSearch={onSearch}
                    />
                </Menu.Item>
                {me ? null // 로그인 여부를 통해 회원가입 메뉴 보여주고 보여주지 않음
                : <Menu.Item key='signup'>
                    <Link href='/signup'><a>회원가입</a></Link>
                </Menu.Item>
                }
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {me ? <UserProfile /> : <LoginForm /> } {/* 로그인 했으면 프로필을 로그인 하지 않았을 경우 로그인폼을 보여줌 */}
                </Col>
                <Col xs={24} md={15}>
                    {children}
                </Col>
            </Row>
        </div>
    )
}

AppLayout.propTypes ={
    children : PropTypes.node.isRequired
}

export default AppLayout;