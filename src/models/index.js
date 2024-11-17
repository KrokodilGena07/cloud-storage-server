const db = require('../config/db');
const {DataTypes, INTEGER} = require('sequelize');

const User = db.define('user', {
    id: {type: DataTypes.UUID, primaryKey: true},
    username: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.STRING},
    activationLink: {type: DataTypes.UUID, allowNull: false, unique: true}
});

const ActivatedUser = db.define('activated_user', {
    id: {type: DataTypes.UUID, primaryKey: true},
});

const UserStorage = db.define('user_storage', {
    id: {type: DataTypes.UUID, primaryKey: true},
    storageSize: {type: INTEGER, defaultValue: 1024 * 8},
    usedSize: {type: INTEGER, defaultValue: 0}
});

const Token = db.define('token', {
    id: {type: DataTypes.UUID, primaryKey: true},
    refreshToken: {type: DataTypes.STRING, allowNull: false, unique: true}
});

User.hasOne(ActivatedUser);
ActivatedUser.belongsTo(User);

User.hasOne(UserStorage);
UserStorage.belongsTo(User);

User.hasOne(Token);
Token.belongsTo(User);

module.exports = {
    User,
    ActivatedUser,
    UserStorage,
    Token
};