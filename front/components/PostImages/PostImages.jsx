/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from '../imagesZoom';
import styles from './PostImages.module.css';

const PostImages = ({ images }) => {
    
    const [showImagesZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback( () => {
        setShowImagesZoom(true);
    }, [])
    const onClose = useCallback( () => {
        setShowImagesZoom(false);
    }, [])

    if(images.length === 1){
        return (
            <>
                <img role='presentation' src={`${images[0].src}`} alt={images[0].src} onClick={onZoom} />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    }

    if(images.length === 2) {
        return (
            <>
                <img role='presentation' className={styles.img} src={`${images[0].src}`} alt={images[0].src} onClick={onZoom} />
                <img role='presentation' className={styles.img} src={`${images[1].src}`} alt={images[1].src} onClick={onZoom} />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    }

    return(
        <>
            <div>
                <img role='presentation' className={styles.moreimg} src={`${images[0].src}`} alt={images[0].src} onClick={onZoom} />
                <div
                    role='presentation'
                    className={styles.div}
                    onClick={onZoom}>
                        <PlusOutlined />
                        <br />
                        {images.length-1}
                        개의 사진 더보기
                </div>
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
        </>
    )
}

PostImages.proptypes= {
    images: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default PostImages;