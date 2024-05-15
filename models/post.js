const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id'}
    }
  },
  { 
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'post'
  }
)

module.exports = Post