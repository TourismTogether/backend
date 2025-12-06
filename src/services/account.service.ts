import bcrypt from "bcrypt";
import { IAccount, accountModel } from "../models/account.model";
import { APIResponse, STATUS } from "../types/response";
import config from "../configs/config";

const accountService = {
    async findAll(): Promise<APIResponse<Array<IAccount>>> {
        const accounts = await accountModel.findAll();
        if (accounts) {
            return {
                status: STATUS.OK,
                message: "Successfully",
                data: accounts
            };
        }
        return {
            status: STATUS.NOT_FOUND,
            message: "",
            error: true
        };
    },

    async findById(id: string): Promise<APIResponse<IAccount>> {
        const account = await accountModel.findById(id);
        if (!account) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Not found account",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: account
        };
    },

    async createOne(account: IAccount): Promise<APIResponse<IAccount>> {
        if (!account.password) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "password is require",
                error: true
            }
        }
        account.password = bcrypt.hashSync(account.password, config.saltRounds);
        const newAccount = await accountModel.createOne(account);
        if (!newAccount) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create new account",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newAccount
        };
    },

    async updateById(id: string | undefined, account: Partial<IAccount>): Promise<APIResponse<IAccount>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined"
            }
        }
        if (account.password) {
            account.password = bcrypt.hashSync(account.password, config.saltRounds);
        }
        const updatedAccount = await accountModel.updatedById(id, account);
        if (!updatedAccount) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update account"
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updatedAccount
        }
    },

    async deleteById(id: string | undefined): Promise<APIResponse<IAccount>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined"
            }
        }
        const result = await accountModel.deleteById(id);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to delete account",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully"
        }
    }
}

export default accountService;