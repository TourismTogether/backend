import { Session } from "express-session";
import { IUser } from "../models/user.model";
import { IUserResponse } from "../dto/userResponse";

export interface ISession extends Session {
    isAuthenticated?: boolean;
    user?: IUser | undefined | null
}