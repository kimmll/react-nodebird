const passport = require('passport')
const bcrypt = require('bcrypt')
const { Strategy: LocalStrategy } = require('passport-local')
const { User } = require('../models')

module.exports = () => { 
    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password', // front에서 data.email, data.password가 back에서는 req.body.email형식으로 바뀜
    }, async (email, password, done) => { // 
        try {
            const user = await User.findOne({
                where : { email }
            })
            if(!user) {
                return done(null, false, {reason : '존재하지 않는 사용자입니다.'}) // (서버에러, 성공, 클라이언트에러)
            }
            const result = await bcrypt.compare(password, user.password) // 비밀번호 비교
            if(result) { // 비밀번호가 맞다면
                return done(null, user) // 사용자 정보를 넘겨줌
            }
            return done(null, false, {reason : '비밀번호 틀렸잖아'})
        } catch (error) {
            console.error(error)
            return done(error)
        }
    }))
}