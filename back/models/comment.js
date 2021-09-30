const DataTypes = require('sequelize')
const { Model } = DataTypes

module.exports = class Comment extends Model {
    static init(sequelize) { // Model의 init을 호출해야 테이블이 생성
        return super.init({ // 상속받은 곳에서 부모를 호출할 때 super 사용
            content : {
                type : DataTypes.TEXT,
                allowNull : false,
            }
        }, {
            modelName : 'Comment',
            tableName : 'Comments',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci',
            sequelize, // index의 연결 객체
        })
    }
    static associate(db) {
        db.Comment.belongsTo(db.User)
        db.Comment.belongsTo(db.Post)
    }
}