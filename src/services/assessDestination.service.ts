import {
  IAssessDestination,
  assessDestinationModel,
} from "../models/assessDestination.model";
import { APIResponse, STATUS } from "../types/response";

const assessDestinationService = {
  async getByDestination(
    destinationId: string | undefined
  ): Promise<APIResponse<IAssessDestination[]>> {
    if (!destinationId) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "destination_id is undefined",
        error: true,
      };
    }

    const data = await assessDestinationModel.findByDestinationId(
      destinationId
    );
    return {
      status: STATUS.OK,
      message: "Successfully",
      data,
    };
  },

  async createOne(
    assess: IAssessDestination
  ): Promise<APIResponse<IAssessDestination>> {
    if (!assess.traveller_id || !assess.destination_id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "missing ids",
        error: true,
      };
    }

    assess.created_at = new Date();
    assess.updated_at = new Date();

    const result = await assessDestinationModel.createOne(assess);
    if (!result) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "failed to create",
        error: true,
      };
    }

    return { status: STATUS.OK, message: "Successfully", data: result };
  },

  async updateOne(
    assess: IAssessDestination
  ): Promise<APIResponse<IAssessDestination>> {
    assess.updated_at = new Date();

    const result = await assessDestinationModel.updateOne(assess);
    if (!result) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "failed to update",
        error: true,
      };
    }

    return { status: STATUS.OK, message: "Successfully", data: result };
  },

  async deleteOne(
    travellerId: string | undefined,
    destinationId: string | undefined
  ): Promise<APIResponse<null>> {
    if (!travellerId || !destinationId) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "missing ids",
        error: true,
      };
    }

    const result = await assessDestinationModel.deleteOne(
      travellerId,
      destinationId
    );
    if (!result) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "failed to delete",
        error: true,
      };
    }

    return { status: STATUS.OK, message: "Successfully" };
  },
};

export default assessDestinationService;
