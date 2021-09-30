const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const {User, Post, Image, Comment} = require('../models')
const db = require('../models')
const {isLoggedIn, isNotLoggedIn} = require('./middlewares')
const user = require('../models/user')
const router = express.Router()
const { Op } = require('sequelize')

router.get('/', async (req, res, next) => { // 브라우저에서 새로고침할 때 마다 보내는 요청
    try {
        if(req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where : {id : req.user.id},
                attributes : {
                    exclude : ['password'] // 전체 데이터 중 비밀번호만 빼고 가져옴
                },
                include : [{
                    model : Post,
                    attributes : ['id']
                }, {
                    model : User,
                    as : 'Followings', // model에서 as를 썻을 경우 똑같이 as써야함
                    attributes : ['id']
                }, {
                    model : User,
                    as : 'Followers',
                    attributes : ['id']
                }]
            })
            res.status(200).json(fullUserWithoutPassword)
        } else{
            res.status(200).json(null)
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/followers', isLoggedIn, async(req, res, next) => { // GET /user/followers
    try{
        const user = await User.findOne({ where : {id : req.user.id}})
        if(!user){
            return res.status(403).send('없는 사람입니다.')
        }
        const followers = await user.getFollowers({
            limit : parseInt(req.query.limit, 10)
        })
        res.status(200).json(followers) // json안 데이터가 front->reducer -> action.data
    } catch(error) {
        console.error(error)
        next(error)
    }
})

router.get('/followings', isLoggedIn, async(req, res, next) => { // GET /user/followings
    try{
        const user = await User.findOne({ where : {id : req.user.id}})
        if(!user){
            return res.status(403).send('없는 사람입니다.')
        }
        const followings = await user.getFollowings({
            limit : parseInt(req.query.limit, 10)
        })
        res.status(200).json(followings) // json안 데이터가 front->reducer -> action.data
    } catch(error) {
        console.error(error)
        next(error)
    }
})

router.get('/:userId', async (req, res, next) => { // GET /user/1
    try {
        const fullUserWithoutPassword =  await User.findOne({
            where : {id : req.params.userId},
            attributes : {
                exclude : ['password']
            },
            include : [{
                model : Post,
                attributes : ['id']
            }, {
                model : User,
                as : 'Followings',
                attributes : ['id']
            }, {
                model : User,
                as : 'Followers',
                attributes : ['id']
            }]
        })
        if(fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON()
            data.Posts = data.Posts.length // 개인정보 침해 예방
            data.Followers = data.Followers.length;
            data.Followings = data.Followings.length;
            res.status(200).json(data);
        } else {
            res.status(404).json('존재하지 않는 사용자입니다.')
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/:userId/posts', async (req, res, next) => { // GET /user/1/posts
    try { // limit - offset 방식은 게시글 가져오는 중 추가되거나 삭제되었을 때 문제가 있을 수 있음
        const where = { UserId : req.params.userId }
        if(parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
            where.id = { [Op.lt] : parseInt(req.query.lastId, 10)}
        }
        const posts = await Post.findAll({ // 모든 게시글 가져옴
            //where : { id : lastId },
            where,
            limit : 10, // 10개만 가져오기
            order : [['createdAt' , 'DESC'], [Comment, 'createdAt', 'DESC']],
            include : [{
                model : User,
                attributes : ['id', 'nickname']
            }, {
                model : Image,
            }, {
                model : Comment,
                include : [{
                    model : User,
                    attributes : ['id', 'nickname']
                }]
            }, {
                model : User, // 좋아요 누른 사람 
                as : 'Likers',
                attributes : ['id']
            }, {
                model : Post,
                as : 'Retweet',
                include : [{
                    model : User,
                    attributes : ['id', 'nickname']
                }, {
                    model : Image,
                }]
            }]
        }) 
        console.log(posts)
        res.status(200).json(posts)
    } catch(error) {
        console.error(error)
        next(error)
    }
})

router.post('/login', isNotLoggedIn, (req, res, next) => { // Post /user/login
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err)
            return next(err)
        }
        if(info) { // 로그인 실패했을 때
            return res.status(401).send(info.reason)
        }
        return req.login(user, async (loginErr) => { // 실행후 index의 serializeUser 실행
            if(loginErr) {
                console.log(loginErr)
                return next(loginErr)
            }
            // res.setHeader('Cookie', 'asdfasd') 쿠키보내줌
            const fullUserWithoutPassword = await User.findOne({
                where : {id : user.id},
                attributes : {
                    exclude : ['password'] // 전체 데이터 중 비밀번호만 빼고 가져옴
                },
                include : [{
                    model : Post,
                    attributes : ['id']
                }, {
                    model : User,
                    as : 'Followings', // model에서 as를 썻을 경우 똑같이 as써야함
                    attributes : ['id']
                }, {
                    model : User,
                    as : 'Followers',
                    attributes : ['id']
                }]
            })
            return res.status(200).json(fullUserWithoutPassword)
        })
    })(req, res, next)
}) // POST/user/login

router.post('/', isNotLoggedIn, async (req, res, next) => { // POST/user/
    try{
        const exUser = await User.findOne({ // 저장되어 있는 email중에 중복되는게 있는지 체크
            where: {
                email : req.body.email
            }
        })
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.')
            
        }
        // 요청/응답은 헤더(상태, 용량, 시간, 쿠키)와 바디(데이터)로 구성
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            email : req.body.email,
            nickname : req.body.nickname,
            password : hashedPassword,
        })
        //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000') // CORS 문제 해결을 위해 header에 추가. 두번째 인자 *로 할 경우 모든 서버 허용
        res.status(201).send('ok')
    } catch(error) {
        console.error(error)
        next(error) // status 500 (server error)
    }
})

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.logout()
    req.session.destroy()
    res.send('ok')
})

router.patch('/nickname', isLoggedIn, async(req, res, next) => { // 닉네임 변경
    try{
        await User.update({
            nickname : req.body.nickname,
        }, {
            where : {id : req.user.id}
        })
        res.status(200).json({ nickname : req.body.nickname })
    } catch(error) {
        console.error(error)
        next(error)
    }
})

router.patch('/:userId/follow', isLoggedIn, async(req, res, next) => { // PATCH /user/1/follow
    try{
        const user = await User.findOne({ where : {id : req.params.userId}})
        if(!user){
            res.status(403).send('없는 사람입니다.')
        }
        await user.addFollowers(req.user.id)
        res.status(200).json({UserId : parseInt(req.params.userId, 10)}) // json안 데이터가 front->reducer -> action.data
    } catch(error) {
        console.error(error)
        next(error)
    }
})

router.delete('/:userId/follow', isLoggedIn, async(req, res, next) => { // DELETE /user/1/follow
    try{
        const user = await User.findOne({ where : {id : req.params.userId}})
        if(!user) {
            res.status(403).send('없는 사람입니다.')
        }
        await user.removeFollowers(req.user.id)
        res.status(200).json({UserId : parseInt(req.params.userId, 10) })
    } catch(error) {
        console.error(error)
        next(error)
    }
})

router.delete('/follower/:userId', isLoggedIn, async(req, res, next) => { 
    try{
        const user = await User.findOne({ where : {id : req.params.userId}})
        if(!user) {
            res.status(403).send('없는 사람입니다.')
        }
        await user.removeFollowings(req.user.id)
        res.status(200).json({UserId : parseInt(req.params.userId, 10) })
    } catch(error) {
        console.error(error)
        next(error)
    }
})

module.exports = router