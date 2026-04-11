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
                message: "Email already exists",
                error: true
            }
        }
        if (user.phone) {
            const isExistPhone = await userModel.findByPhone(user.phone);
            if (isExistPhone) {
                return {
                    status: STATUS.CONFLICT,
                    message: "Phone already exists",
                    error: true
                }
            }
        }
        if (!account.password) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Password is required",
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
        if (!account.password) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Password is required",
                error: true
            }
        }

        let foundAccount: IAccount | undefined;

        const rawLogin = (account.email ?? account.username ?? "").trim();
        if (!rawLogin) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Email or username is required",
                error: true
            };
        }

        // Login form sends a single field as `email`; treat values without "@" as username.
        if (rawLogin.includes("@")) {
            foundAccount = await accountModel.findByEmail(rawLogin.toLowerCase());
        } else {
            foundAccount = await accountModel.findByUsername(rawLogin);
        }

        if (!foundAccount || !foundAccount.id || !foundAccount.password) {
            return {
                status: STATUS.UNAUTHORIZED,
                message: "Invalid email/username or password",
                error: true
            }
        }

        if (!bcrypt.compareSync(account.password, foundAccount.password)) {
            return {
                status: STATUS.UNAUTHORIZED,
                message: "Invalid email/username or password",
                error: true
            }
        }

        const user = await userModel.findByAccountId(foundAccount.id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "User profile not found",
                error: true
            }
        }

        delete foundAccount.password;

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: {
                account: foundAccount,
                user
            }
        }
    }
}

export default authService;