module.exports = (sequelize, Sequelize) => {
  const AnswerKey = sequelize.define("AnswerKey", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    questionBankId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "QuestionBanks",
        key: "id",
      },
      unique: true, // one answer key set per question bank (if you want one-to-one)
    },
    // type to indicate if this answer key is regular or explanation
    answerKeyType: {
      type: Sequelize.ENUM("REGULAR", "WITH_EXPLANATION"),
      allowNull: false,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    path: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    size: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });

  AnswerKey.associate = (models) => {
    AnswerKey.belongsTo(models.QuestionBank, {
      foreignKey: "questionBankId",
      as: "questionBank",
    });
  };

  return AnswerKey;
};
