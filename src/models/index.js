const db = require('../config/db');
const {DataTypes} = require('sequelize');

const User = db.define('user', {
    id: {type: DataTypes.STRING, primaryKey: true},
    username: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    activationLink: {type: DataTypes.STRING, allowNull: false, unique: true},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    image: {type: DataTypes.STRING}
});

const Token = db.define('token', {
    id: {type: DataTypes.STRING, primaryKey: true},
    refreshToken: {type: DataTypes.STRING, allowNull: false, unique: true}
});

User.hasOne(Token);
Token.belongsTo(User);

module.exports = {
    User, Token
};