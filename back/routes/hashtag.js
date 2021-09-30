const express = require('express')
const { Hashtag, Post, Image, Comment, User } = require('../models')
const router = express.Router()
const { Op } =  require('sequelize')

router.get('/:hashtag', async (req, res, next) => { // GET /posts
    try { // limit - offset 방식은 게시글 가져오는 중 추가되거나 삭제되었을 때 문제가 있을 수 있음
        const where = {}
        if(parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
            where.id = { [Op.lt] : parseInt(req.query.lastId, 10)}
        }
        const posts = await Post.findAll({ // 모든 게시글 가져옴
            //where : { id : lastId },
            where,
            limit : 10, // 10개만 가져오기
            order : [['createdAt' , 'DESC'], [Comment, 'createdAt', 'DESC']],
            include : [{
                model : Hashtag,
                where : { name : decodeURIComponent(req.params.hashtag) }
            }, {
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

module.exports =  router