module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
     title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Title cannot be empty" },
        },
      },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'typeId is required' },
        isInt: { msg: 'typeId must be an integer' },
      },
    },
    pdfPath: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'pdfPath cannot be empty' },
      },
    },
 year: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notEmpty: { msg: 'Year cannot be empty' },
    is: {
      args: /^[0-9]{4}(-[0-9]{4})?$/,
      msg: 'Year must be a 4-digit string or a range like "2019-2020"',
    },
  },
},


  }, {
    tableName: 'results',
    timestamps: true,
  });

  return Result;
};
