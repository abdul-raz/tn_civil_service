'use strict';

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

      // Question Paper
      questionPaperPath: {
        type: DataTypes.TEXT,
        allowNull: false,  // must needed
      },
      questionPaperSize: {
        type: DataTypes.TEXT,
        allowNull: false,  // must needed
      },

      // Answer Key
      answerKeyPath: {
        type: DataTypes.TEXT,
        allowNull: false,  // must needed
      },
      answerKeySize: {
        type: DataTypes.TEXT,
        allowNull: false,  // must needed
      },

      // Key Explanation (optional)
      keyExplanationPath: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      keyExplanationSize: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      year: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Inactive',
      },
    },
    {
      timestamps: true,
    }
  );
};


// 'use strict';

// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define(
//     "QuestionBank",
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       name: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//       type: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//       size: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//       path: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//        year: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//       status: {  
//       type: DataTypes.ENUM('Active', 'Inactive'),
//       allowNull: false,
//       defaultValue: 'Inactive',
//     },
//     },
//     {
//       timestamps: true
//     }
//   );
// };
