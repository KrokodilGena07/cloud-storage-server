const db = require('../config/db');
const {File} = require('../models');
const updateParents = async (folderId, size, operation) => {
    const folder = await File.findByPk(folderId);
    if (!folder) return;

    await folder[operation]('size', {by: size});
    await updateParents(folder.folderId, size, operation);
};

module.exports = updateParents;