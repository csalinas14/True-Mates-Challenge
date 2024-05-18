const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Photo extends Model {}

Photo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'posts', key: 'id'}
    },
  },
  { 
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'photo'
  }
)

module.exports = Photo