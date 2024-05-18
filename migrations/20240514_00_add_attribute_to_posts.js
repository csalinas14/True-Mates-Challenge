const { DataTypes } = require('sequelize')

module.exports = {
  up: async({ context: queryInterface }) => {
    await queryInterface.addColumn('posts', 'attribute', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Default'
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('posts', 'attribute')
  }
}