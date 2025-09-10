module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Gallery", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    imageUrl: { type: DataTypes.STRING, allowNull: false }, // Or DataTypes.BLOB for binary
    label: { type: DataTypes.STRING },
  });
};
