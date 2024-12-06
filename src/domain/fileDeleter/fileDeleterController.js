const fileDeleterModel = require('./fileDeleterModel');

class FileDeleterController {
    async deleteOne(req, res, next) {
        try {
            const {id} = req.params;
            await fileDeleterModel.deleteOne(id);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }

    async deleteMany(req, res, next) {
        try {

        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FileDeleterController();