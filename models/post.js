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
  },
  { 
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'post'
  }
)

module.exports = Post