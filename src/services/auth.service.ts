import config from "../configs/config";
import bcrypt from "bcrypt";
import { APIResponse, STATUS } from "../types/response";
import { accountModel, IAccount } from "../models/account.model";
import { IUser, userModel } from "../models/user.model";
import { ITraveller } from "../models/traveller.model";
import travellerService from "./traveller.service";

const authService = {
    async signUp(account: IAccount, user: IUser): Promise<APIResponse<{ account: IAccount, user: IUser }>> {
        const isExistEmail = await accountModel.findByEmail(account.email);
        if (isExistEmail) {
            return {
                status: STATUS.CONFLICT,
                message: "Email already exists"
            }
        }
        if (user.phone) {
            const isExistPhone = await userModel.findByPhone(user.phone);
            if (isExistPhone) {
                return {
                    status: STATUS.CONFLICT,
                    message: "Phone already exists"
                }
            }
        }
        if (!account.password) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "password is empty",
                error: true
            }
        }
        account.password = bcrypt.hashSync(account.password, config.saltRounds);
        const newAccount = await accountModel.createOne(account);

        if (!newAccount || !newAccount.id) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to sign up",
                error: true
            }
        }

        user.account_id = newAccount?.id;
        user.created_at = new Date(Date.now());
        user.updated_at = new Date(Date.now());

        const newUser = await userModel.createOne(user);
        if (!newUser) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to sign up",
                error: true
            }
        }

        const newTraveller: ITraveller = {
            user_id: newUser.id || "",
            bio: "",
            is_shared_location: false,
            latitude: 0,
            longitude: 0,
            travel_preference: [],
            emergency_contacts: [],
            is_safe: true
        }
        travellerService.createOne(newTraveller);

        delete newAccount.password;

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: {
                account: newAccount,
                user: newUser
            }
        }
    },

    async signIn(account: IAccount): Promise<APIResponse<{ account: IAccount, user: IUser }>> {
        const emailAccount = await accountModel.findByEmail(account.email);
        if (!emailAccount || !emailAccount.id || !emailAccount.password) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Email or password is incorrect",
                error: true
            }
        }

        if (!account.password) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "password is empty",
                error: true
            }
        }

        if (!bcrypt.compareSync(account.password, emailAccount.password)) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Email or password is incorrect",
                error: true
            }
        }

        const user = await userModel.findByAccountId(emailAccount.id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "User is not found"
            }
        }

        delete emailAccount.password;

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: {
                account: emailAccount,
                user
            }
        }
    }
}

export default authService;