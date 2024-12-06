class ErrorTextList {
    static INVALID_DATA = 'Check your data, please';
    static INVALID_IMAGE = 'Image is invalid';
    static UNEXPECTED_ERROR = 'Unexpected error';

    static MAIL_ERROR = 'User with this email already exists';
    static ACTIVATION_ERROR = 'Activation link is wrong';

    static LOGIN_EMPTY_DATA = 'Email or password is empty';
    static USER_NOT_FOUND = 'User with this email wasn\'t found';
    static PASSWORD_ERROR = 'Password is wrong';

    static USER_HAS_NO_IMAGE = 'User has no image';

    static EMPTY_FILE_ERROR = 'File is empty';
    static FILE_NAME_ERROR = 'This name already exists';
    static STORAGE_SIZE_ERROR = 'Your storage is full';
}

module.exports = ErrorTextList;