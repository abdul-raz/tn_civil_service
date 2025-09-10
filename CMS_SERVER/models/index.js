const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import all models
db.QuestionBank = require("./questionBank.model")(sequelize, Sequelize);
db.Gallery = require("./gallery.model")(sequelize, Sequelize);
db.Result = require("./result.model")(sequelize, Sequelize);
db.AnswerKey = require("./answerKey.model")(sequelize, Sequelize);

// Setup associations if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
