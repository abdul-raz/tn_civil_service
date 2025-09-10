module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Result", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    examId: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.INTEGER, allowNull: false },
    // add fields for details, timestamps, status, etc.
  });
};
