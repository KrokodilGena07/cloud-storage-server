const userStoragesModel = require('./userStoragesModel');

class UserStoragesController {
    async get(req, res, next) {
        try {
            const {userId} = req.params;
            const data = await userStoragesModel.get(userId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserStoragesController();