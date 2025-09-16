module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "QuestionBank",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      size: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true
    }
  );
};
