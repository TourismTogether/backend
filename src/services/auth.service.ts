import { IUser, userModel } from "../models/user.model";
import config from "../configs/config";
import bcrypt from "bcrypt";
import { APIResponse, STATUS } from "../types/response";

const authService = {
    async signUp(user: IUser) {
        const isExistEmail = await userModel.findByEmail(user.email);
        if (isExistEmail) {
            return {
                status: STATUS.CONFLICT,
                message: "Email already exists"
            }
        }
        const isExistPhone = await userModel.findByPhone(user.phone);
        if (isExistPhone) {
            return {
                status: STATUS.CONFLICT,
                message: "Phone already exists"
            }
        }

        user.created_at = new Date(Date.now());
        user.updated_at = new Date(Date.now());
        user.password = bcrypt.hashSync(user.password, config.saltRounds);

        const newUser = await userModel.createOne(user);
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newUser
        }
    }
}

export default authService;