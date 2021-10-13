import { Form, Button, Input } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import styles from './PostForm.module.css'
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../../reducers/post'
import useInput from '../../hooks/useInput';
//import { backUrl } from '../../config/config';

const PostForm = () => {
    const dispatch = useDispatch() // dispatch 설정
    const inputRef = useRef() // inputRef
    const { imagePaths, addPostDone } = useSelector( state => state.post) // post객체에서 imagePaths 가져옴
    const [text, onChangeText, setText] = useInput('') // 글 입력 스테이트

    useEffect ( () => { // 트윗 작성 완료되면 텍스트칸 초기화
        if(addPostDone) {
            setText('')
        }
    },[addPostDone])

    const onSubmit = useCallback( () => { // 짹짹 버튼 클릭시 (트윗작성)
        if(!text || !text.trim()) { // text 입력이 없다면
            return alert('게시글을 작성하세요!') // alert 창 생성
        }
        const formData = new FormData() // formData 형식으로 데이터 생성
        imagePaths.forEach( p => { // 이미지 경로
            formData.append('image', p)
        })
        formData.append('content', text) // 폼데이터에 텍스트 입력값 넣음
        return dispatch({
            type : ADD_POST_REQUEST, // 트윗작성 요청
            data : formData
        })
    }, [text, imagePaths])

    const onClickImageUpload = useCallback( () => { // 이미지 업로드 버튼 클릭시
        inputRef.current.click()
    },[inputRef.current]) 

    const onChangeImages = useCallback( (e) => {
        console.log('images', e.target.files)
        const imageFormData = new FormData() // formData형식으로 보내면 multipart 형식으로 보낼 수 잇음
        Array.prototype.forEach.call(e.target.files, (f)=> { // e.target.files가 배열이 아님, 유사배열형태
            imageFormData.append('image', f)
        })
        dispatch({
            type : UPLOAD_IMAGES_REQUEST,
            data : imageFormData,
        })
    })

    const onRemoveImage = useCallback( (index) => () => {
        dispatch({
            type : REMOVE_IMAGE,
            data : index,
        })
    })

    return (
        <Form className={styles.form} encType='multipart/form-data' onFinish={onSubmit}>
            <Input.TextArea 
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder='입력해주세요'
            />
            <div>
                <input type='file' name='image' multiple hidden ref={inputRef} onChange={onChangeImages}/>
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type='primary' className={styles.button} htmlType='submit' >짹짹</Button>
            </div>
            <div>
                {imagePaths.map( (v, i) => (
                    <div key={v} className={styles.div}>
                        {/*<img src={`${backUrl}/${v}`} className={styles.img} alt={v} />*/}
                        <img src={v.replace(/\/thumb\//, '/original/')} className={styles.img} alt={v} />
                        <div>
                            <Button onClick={onRemoveImage(i)}>제거</Button> {/* map안에 callback 함수를 만들고 싶으면 고차함수로 */}
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    )
}

export default PostForm;