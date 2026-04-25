import { Request, Response, NextFunction } from "express";
import accountService from "../services/account.service";
import { IAccount } from "../models/account.model";

class AccountController {
    // GET - /accounts
    async getAllAccounts(req: Request, res: Response, next: NextFunction) {
        try {
            const hasPagination = req.query.page !== undefined || req.query.pageSize !== undefined;
            if (hasPagination) {
                const page = Number(req.query.page ?? 1);
                const pageSize = Number(req.query.pageSize ?? 10);
                const result = await accountService.findAllPaginated(page, pageSize);
                return res.status(result.status).json(result);
            }
            const result = await accountService.findAll();
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /accounts
    async createAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const account: IAccount = req.body;
            const result = await accountService.createOne(account);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /accounts/:id
    async updatedAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const account = req.body;
            const result = await accountService.updateById(id, account);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /accounts/:id
    async deleteAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await accountService.deleteById(id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new AccountController();