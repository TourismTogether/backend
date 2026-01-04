import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import authService from "../services/auth.service";
import { userModel } from "../models/user.model";
import { IAccount } from "../models/account.model";
import { STATUS } from "../types/response";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (username: string, password: string, done) => {
            try {
                const account: IAccount = {
                    username: "",
                    email: username,
                    password: password
                }
                const result = await authService.signIn(account);
                if (result.status === STATUS.OK) {
                    return done(null, result.data);
                }
                else {
                    return done(null, false, { message: result.message });
                }
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((data: any, done) => {
    if (!data || !data.user.id) {
        return done(new Error("User or user.id is missing"));
    }

    done(null, data.user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return done(new Error("User not found"));
        }

        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
