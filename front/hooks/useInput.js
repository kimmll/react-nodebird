/*
    커스텀훅  -> signup.js의 input 값 설정 부분을 공통으로 사용
    input에 쓰여지는 값과 값을 업데이트 하는 함수를 리턴해줌
*/

import { useState, useCallback } from "react";

export default ( initialValue = null ) => {
    const [value, setValue] = useState(initialValue)
    const handler = useCallback ( (e) => {
        setValue(e.target.value)
    }, [] )
    return [value, handler, setValue]
}