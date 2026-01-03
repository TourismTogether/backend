import { IDiary } from "../models/diary.model";
import { IPost } from "../models/post.model";
import { travellerModel, ITraveller } from "../models/traveller.model";
import { userModel } from "../models/user.model";
import { APIResponse, STATUS } from "../types/response";

const travellerService = {
    async findAll(): Promise<APIResponse<ITraveller[]>> {
        const travellers = await travellerModel.findAll();
        if (!travellers) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Failed to find"
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: travellers,
        };
    },

    async findById(id: string | undefined): Promise<APIResponse<ITraveller>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true,
            };
        }

        const traveller = await travellerModel.findById(id);
        if (!traveller) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Traveller not found",
                error: true,
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: traveller,
        };
    },

    async createOne(traveller: ITraveller): Promise<APIResponse<ITraveller>> {
        if (!traveller.user_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is required",
                error: true,
            };
        }

        const user = await userModel.findById(traveller.user_id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Not found user_id",
                error: true
            }
        }

        const newTraveller = await travellerModel.createOne(traveller);
        if (!newTraveller) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create traveller",
                error: true
            }
        }

        return {
            status: STATUS.CREATED,
            message: "Successfully",
            data: newTraveller,
        };
    },

    async updateById(id: string | undefined, traveller: Partial<ITraveller>): Promise<APIResponse<ITraveller>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true,
            };
        }

        const exist = await travellerModel.findById(id);
        if (!exist) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Traveller not found",
                error: true,
            };
        }

        const updated = await travellerModel.updateById(id, traveller);
        if (!updated) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update traveller",
                error: true
            }
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updated,
        };
    },

    async deleteById(id: string | undefined) {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true,
            };
        }
        const result = await travellerModel.deleteById(id);
        if (!result) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Failed to delete traveller",
                error: true,
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
        };
    },

    async getListDiaries(user_id: string | undefined): Promise<APIResponse<Array<IDiary>>> {
        if (!user_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is require"
            }
        }
        const listDiaries = await travellerModel.getListDiaries(user_id);
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: listDiaries
        }
    },

    async getListPosts(user_id: string | undefined): Promise<APIResponse<Array<IPost>>> {
        if (!user_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is require"
            }
        }
        const ListPosts = await travellerModel.getListPosts(user_id);
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: ListPosts
        }
    },

    async findAllSOS(): Promise<APIResponse<Array<ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string }>>> {
        // Sử dụng findAll() có sẵn và filter
        const allTravellers = await travellerModel.findAll();
        const sosTravellers = allTravellers.filter(
            (t) => t.is_safe === false && t.is_shared_location === true
        );

        // Fetch user info cho mỗi SOS traveller
        const sosWithUsers = await Promise.all(
            sosTravellers.map(async (traveller) => {
                if (!traveller.user_id) return traveller as ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string };
                try {
                    const user = await userModel.findById(traveller.user_id);
                    const result: ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string } = {
                        ...traveller,
                    };
                    if (user?.full_name) result.user_full_name = user.full_name;
                    if (user?.phone) result.user_phone = user.phone;
                    if (user?.avatar_url) result.user_avatar_url = user.avatar_url;
                    return result;
                } catch {
                    return traveller as ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string };
                }
            })
        );

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: sosWithUsers
        };
    },

    async findSOSBySupporterId(supporterId: string | undefined): Promise<APIResponse<Array<ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string }>>> {
        if (!supporterId) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "supporter_id is undefined",
                error: true
            };
        }

        // Sử dụng findAll() có sẵn và filter
        const allTravellers = await travellerModel.findAll();
        const sosTravellers = allTravellers.filter((t) => {
            if (t.is_safe !== false || t.is_shared_location !== true) return false;
            
            // Parse emergency_contacts từ jsonb (có thể là string hoặc array)
            let contacts: string[] = [];
            if (t.emergency_contacts) {
                if (typeof t.emergency_contacts === 'string') {
                    try {
                        contacts = JSON.parse(t.emergency_contacts);
                    } catch {
                        contacts = [];
                    }
                } else if (Array.isArray(t.emergency_contacts)) {
                    contacts = t.emergency_contacts;
                }
            }
            
            // Nếu không có contacts hoặc rỗng -> yêu cầu chung (màu vàng)
            if (!contacts || contacts.length === 0) {
                return true;
            }
            
            // Kiểm tra xem supporterId có trong emergency_contacts không
            return contacts.includes(supporterId);
        });

        // Fetch user info cho mỗi SOS traveller
        const sosWithUsers = await Promise.all(
            sosTravellers.map(async (traveller) => {
                if (!traveller.user_id) return traveller as ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string };
                try {
                    const user = await userModel.findById(traveller.user_id);
                    const result: ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string } = {
                        ...traveller,
                    };
                    if (user?.full_name) result.user_full_name = user.full_name;
                    if (user?.phone) result.user_phone = user.phone;
                    if (user?.avatar_url) result.user_avatar_url = user.avatar_url;
                    return result;
                } catch {
                    return traveller as ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string };
                }
            })
        );

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: sosWithUsers
        };
    }
};

export default travellerService;
