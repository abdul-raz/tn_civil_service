module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "AnswerKey",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      questionBankId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "QuestionBanks", // table name, verify with your setup
          key: "id",
        },
        unique: true,
      },
      answerKeyType: {
        type: DataTypes.ENUM("0", "1"), // '0' = only answer key, '1' = answer key with explanation
        allowNull: false,
        defaultValue: "0",
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      size: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
};
