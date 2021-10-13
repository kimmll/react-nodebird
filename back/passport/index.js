const passport = require('passport')
const local = require('./local')
const { User } = require('../models')

module.exports = () => {
    passport.serializeUser( (user, done) => {
        done(null, user.id) // 첫번째 인자는 서버에러, 두번째는 성공
    })
    passport.deserializeUser( async (id, done) => { // 로그인하고 나면 라우터 실행되기 전에 매번 실행됨 로그인정보가 req.user에 저장되어 있음 로그인 후에는 req.user로 검색
        try {
            const user = await User.findOne({
                where : {id}
            })
            done(null, user) // req.user에 저장
        } catch(error) {
            console.error(error)
            done(error)
        }
    })

    local() // local.js의 module.exports 실행
}

