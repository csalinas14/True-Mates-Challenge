const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class FriendsList extends Model {}

FriendsList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id'}
    },
    user2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id'}
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id'}
    },
  },
  { 
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'friendslist'
  }
)

module.exports = FriendsList