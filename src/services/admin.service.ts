import { adminModel, IAdmin } from "../models/admin.model";
import { userModel } from "../models/user.model";
import { APIResponse, STATUS } from "../types/response";

const adminService = {
  async findAll(): Promise<APIResponse<IAdmin[]>> {
    const data = await adminModel.findAll();
    return {
      status: STATUS.OK,
      message: "Successfully",
      data,
    };
  },

  async findById(userId: string | undefined): Promise<APIResponse<IAdmin>> {
    if (!userId) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "user_id is required",
        error: true,
      };
    }

    const data = await adminModel.findById(userId);
    if (!data) {
      return {
        status: STATUS.NOT_FOUND,
        message: "Admin not found",
        error: true,
      };
    }

    return {
      status: STATUS.OK,
      message: "Successfully",
      data,
    };
  },

  async createOne(admin: IAdmin): Promise<APIResponse<IAdmin>> {
    if (!admin.user_id || !admin.key) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "user_id and key are required",
        error: true,
      };
    }

    const user = await userModel.findById(admin.user_id);
    if (!user) {
      return {
        status: STATUS.NOT_FOUND,
        message: "Not found user_id",
        error: true,
      };
    }

    const existingAdmin = await adminModel.findById(admin.user_id);
    if (existingAdmin) {
      return {
        status: STATUS.CONFLICT,
        message: "Admin already exists",
        error: true,
      };
    }

    const created = await adminModel.createOne(admin);
    if (!created) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "Failed to create admin",
        error: true,
      };
    }

    return {
      status: STATUS.CREATED,
      message: "Admin created",
      data: created,
    };
  },

  async updateById(
    userId: string | undefined,
    admin: Partial<IAdmin>
  ): Promise<APIResponse<IAdmin>> {
    if (!userId) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "user_id is required",
        error: true,
      };
    }

    const existing = await adminModel.findById(userId);
    if (!existing) {
      return {
        status: STATUS.NOT_FOUND,
        message: "Admin not found",
        error: true,
      };
    }

    const updated = await adminModel.updateById(userId, admin);
    if (!updated) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "Failed to update admin",
        error: true,
      };
    }

    return {
      status: STATUS.OK,
      message: "Admin updated",
      data: updated,
    };
  },

  async deleteById(userId: string | undefined): Promise<APIResponse<null>> {
    if (!userId) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "user_id is required",
        error: true,
      };
    }

    const existing = await adminModel.findById(userId);
    if (!existing) {
      return {
        status: STATUS.NOT_FOUND,
        message: "Admin not found",
        error: true,
      };
    }

    await adminModel.deleteById(userId);

    return {
      status: STATUS.OK,
      message: "Admin deleted",
    };
  },
};

export default adminService;
