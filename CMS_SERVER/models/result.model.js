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
          args: /^\d{4}(-\d{4})?$/,
          msg: 'Year must be a 4-digit year or a range like "2018-2019"',
        },
      },
    },
  status: {
  type: DataTypes.SMALLINT,  // PostgreSQL compatible small integer type
  allowNull: false,
  defaultValue: 1,           // default active
  validate: {
    isIn: {
      args: [[0, 1]],
      msg: "Status must be 0 (inactive) or 1 (active)"
    }
  }
},

  }, {
    tableName: 'results',
    timestamps: true,
  });

  return Result;
};
