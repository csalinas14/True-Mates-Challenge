const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('photos', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
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
    await queryInterface.addColumn('photos', 'post_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'posts', key: 'id'}
    })
    await queryInterface.changeColumn('posts', 'photo', {
        type: DataTypes.STRING,
        allowNull: true,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('photos')
    await queryInterface.changeColumn('posts', 'photo', {
      type: DataTypes.STRING,
      allowNull: false,
    })
  }
}

