const db = require('../config/db');
const {DataTypes, INTEGER} = require('sequelize');

const User = db.define('user', {
    id: {type: DataTypes.STRING, primaryKey: true},
    username: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.STRING},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING, allowNull: false, unique: true}
});

const UserStorage = db.define('user_storage', {
    id: {type: DataTypes.STRING, primaryKey: true},
    storageSize: {type: INTEGER, defaultValue: 1024 ** 2},
    usedSize: {type: INTEGER, defaultValue: 0}
});

const Token = db.define('token', {
    id: {type: DataTypes.STRING, primaryKey: true},
    refreshToken: {type: DataTypes.STRING, allowNull: false, unique: true}
});

User.hasOne(UserStorage);
UserStorage.belongsTo(User);

User.hasOne(Token);
Token.belongsTo(User);

module.exports = {
    User,
    UserStorage,
    Token
};