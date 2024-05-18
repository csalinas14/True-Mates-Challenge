const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('friendslists', {
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
      requester_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id'}
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })
    await queryInterface.addConstraint('friendslists', {
      fields: ['user1', 'user2'],
      type: 'unique',
      name: 'unique_friends_constraint'
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('friendslists')
  }
}