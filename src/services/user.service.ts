import { IUser, userModel } from "../models/user.model";

const userSevice = {
    findAll() {
        return userModel.findAll();
    },

    createOne(newUser: IUser) {
        return userModel.createOne(newUser);
    }
}

export default userSevice;