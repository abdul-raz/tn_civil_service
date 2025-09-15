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
db.User = require("./user.model")(sequelize, Sequelize);

// Add your master data models
db.ExamType = require("./examtype")(sequelize, Sequelize);
db.Year = require("./year")(sequelize, Sequelize);
db.ProcessDocumentType = require("./processdocumenttype")(sequelize, Sequelize);
db.GalleryCategory = require("./gallerycategory")(sequelize, Sequelize);
db.NotificationType = require("./notificationtype")(sequelize, Sequelize);
db.VideoCategory = require("./videocategory")(sequelize, Sequelize);

// Setup associations if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
