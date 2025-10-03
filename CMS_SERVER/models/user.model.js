const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}

    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init(
    {
      email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password && user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return User;
};
