const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations if needed
    }

    // Validate password
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    // Generate and set a 6-digit OTP with expiry
    async setOtp() {
      const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Hash OTP
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(rawOtp, salt);

      this.otp = hashedOtp;
      this.otpExpiry = new Date(Date.now() + 60 * 1000); // expires in 60s
      await this.save();

      return rawOtp; // return OTP for sending via email/SMS
    }

    // Verify OTP
    async verifyOtp(rawOtp) {
      if (!this.otp || !this.otpExpiry) return false;

      if (new Date() > this.otpExpiry) {
        this.otp = null;
        this.otpExpiry = null;
        await this.save();
        return false;
      }

      const isValid = await bcrypt.compare(rawOtp, this.otp);
      if (isValid) {
        this.otp = null;
        this.otpExpiry = null;
        await this.save();
      }

      return isValid;
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
      otp: { type: DataTypes.STRING, allowNull: true },
      otpExpiry: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password && user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return User;
};
