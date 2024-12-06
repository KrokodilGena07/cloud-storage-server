const fileReaderModel = require('./fileReaderModel');

class FileReaderController {
    async getFiles(req, res, next) {
        try {
            const {userId, folderId, sort} = req.query;
            const data = await fileReaderModel.getFiles(userId, folderId, sort);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async searchFiles(req, res, next) {
        try {
            const {userId, search} = req.query;
            const data = await fileReaderModel.searchFiles(userId, search);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async download(req, res, next) {
        try {

        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FileReaderController();