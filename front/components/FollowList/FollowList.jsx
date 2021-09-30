import React from 'react';
import PropTypes from 'prop-types'
import { List, Button, Card } from 'antd';
import { SyncOutlined } from '@ant-design/icons'
import styles from './FollowList.module.css'
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../../reducers/user'

const FollowList = ({header, data, onClickMore, loading}) => {

    console.log('데이터가 뭘까요? ', data, header)
    const dispatch = useDispatch()
    const onCancel = (id) => () =>{
        if(header === '팔로잉 목록') {
            const con = confirm('삭제하시겠습니까?')
            if(con) {
                dispatch({
                    type : UNFOLLOW_REQUEST,
                    data : id
                })
            }
        } else {
            const followerConfirm = confirm('팔로워를 삭제하시겠습니까?')
            if(followerConfirm) {
                dispatch({
                    type: REMOVE_FOLLOWER_REQUEST,
                    data : id,
                })
            }
        }
    }
    return(
        <List 
            className={styles.list}
            grid={{gutter:4, xs:2, md:3}}
            size='small'
            header={<div>{header}</div>}
            loadMore={<div className={styles.more}><Button onClick={onClickMore} loading={loading}>더 보기</Button></div>}
            bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item className={styles.listItem}>
                    <Card actions={[<SyncOutlined key='stop' onClick={onCancel(item.id)}/>]}>
                        <Card.Meta description={item.nickname} />
                    </Card>
                </List.Item>                  
            )}
        />
    )
}

FollowList.propTypes = {
    header : PropTypes.array.isRequired,
    data : PropTypes.array.isRequired,
    onClickMore : PropTypes.func.isRequired,
    loading : PropTypes.bool.isRequired
}

export default FollowList