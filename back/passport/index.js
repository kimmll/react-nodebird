const passport = require('passport')
const local = require('./local')
const { User } = require('../models')

module.exports = () => {
    passport.serializeUser( (user, done) => {
        done(null, user.id) // 첫번째 인자는 서버에러, 두번째는 성공
    })
    passport.deserializeUser( async (id, done) => { // 로그인 후 라우터 실행전 매번실행
        try {
            const user = await User.findOne({
                where : {id}
            })
            done(null, user) // req.user
        } catch(error) {
            console.error(error)
            done(error)
        }
    })

    local() // local.js의 module.exports 실행
}

