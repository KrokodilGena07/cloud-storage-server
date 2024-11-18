const uuid = require('uuid');
const path = require('path');

const createUserImage = async (image) => {
    const imageId = uuid.v4();
    const ext = image.name.split('.')[1];
    await image.mv(path.resolve(process.env.BASE_PATH, 'images', `${imageId}.${ext}`));
    return `${process.env.API_URL}/${imageId}.${ext}`;
};

module.exports = createUserImage;