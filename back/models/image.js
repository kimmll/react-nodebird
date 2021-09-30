const DataTypes =  require('sequelize')
const { Model } = DataTypes

module.exports = class Image extends Model {
    static init(sequelize) {
        return super.init({
            src : {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
        }, {
            modelName : 'Image',
            tableName : 'Images',
            charset : 'utf8',
            collate:'utf8mb4_general_ci', // 이모티콘 저장
            sequelize,
        })
    }
    static associate(db) {
        db.Image.belongsTo(db.Post)
    }
}