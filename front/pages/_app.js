/**
    pages 폴더안에 있는 파일들의 공통되는 부분을 처리
 */
import React from 'react';
import Head from 'next/head'
import 'antd/dist/antd.css'
import PropTypes from 'prop-types'
import wrapper from '../store/configureStore.js'

const NodeBird = ( { Component } ) => { // Component로 전달되는 값은 pages폴더 안에 있는 파일들의 return 부분이 전달
    return (
        <> {/* next에서는 Provider가 들어가지 않음 */}
            <Head>
                <meta charSet='utf-8' />
                <title>NodeBird</title>
            </Head>
            <Component />
        </>
    )
}

NodeBird.propTypes = {
    Component : PropTypes.elementType.isRequired
}

export default wrapper.withRedux(NodeBird)