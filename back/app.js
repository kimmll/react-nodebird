const express = require('express')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')
const hpp = require('hpp')
const helmet = require('helmet')

const postRouter = require('./routes/post')
const postsRouter = require('./routes/posts')
const userRouter = require('./routes/user')
const hashtagRouter = require('./routes/hashtag')

const db = require('./models')
const passportConfig = require('./passport')

const app = express()
dotenv.config()

db.sequelize.sync()
    .then( () => {
        console.log('db 연결 성공')
    })
    .catch(console.error)

passportConfig()

if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'))
    app.use(hpp())
    app.use(helmet())
} else {
    app.use(morgan('dev'))
}

app.use(cors({
    origin : ['http://localhost:3000', 'nodebird.com', 'http://52.78.111.196'],
    credentials : true, // credentials : true로 해야 서로 다른 도메인간 쿠키가 전달됨
}))

app.use('/', express.static(path.join(__dirname, 'uploads')))
app.use(express.json()) // axios로 데이터를 보낼때. front에서 json형식의 데이터를 보냈을 때 req.body에 json형식으로 데이터를 저장
app.use (express.urlencoded({extended:true})) // 일반폼형식에서 보낼때. front에서 보낸 데이터를 req.body에 저장할 수 있도록함
// form submit 
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    saveUninitialized : false,
    resave : false,
    secret : process.env.COOKIE_SECRET
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.send('hello express')
})

app.get('/api', (req, res) => {
    res.send('hello api')
})

app.use('/post', postRouter)
app.use('/posts', postsRouter)
app.use('/user', userRouter)
app.use('/hashtag', hashtagRouter)

app.listen(80, () => {
    console.log('서버 실행 중')
})