class UserDto {
    constructor(model) {
        this.id = model.id;
        this.username = model.username;
        this.email = model.email;
        this.image = model.image;
        this.isActivated = model.isActivated;
    }
}

module.exports = UserDto;