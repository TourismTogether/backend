import {
  IAssessDestination,
  assessDestinationModel,
} from "../models/assessDestination.model";
import { APIResponse, STATUS } from "../types/response";

const assessDestinationService = {
  async getByDestination(
    destinationId: string | undefined
  ): Promise<APIResponse<IAssessDestination[]>> {
    if (!destinationId || destinationId === "NaN" || destinationId === "undefined" || destinationId.trim() === "") {
      return {
        status: STATUS.BAD_REQUEST,
        message: "Destination ID is required and must be a valid UUID",
        error: true,
      };
    }
    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(destinationId)) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "Invalid Destination ID format. Expected UUID.",
        error: true,
      };
    }

    const data = await assessDestinationModel.findByDestinationId(destinationId);
    return {
      status: STATUS.OK,
      message: "Successfully",
      data,
    };
  },

  async createOne(
    assess: IAssessDestination
  ): Promise<APIResponse<IAssessDestination>> {
    if (!assess.traveller_id || !assess.destination_id || !assess.rating_star) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "missing required fields",
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

    return { status: STATUS.OK, message: "Successfully created", data: result };
  },

  async updateOne(
    assess: IAssessDestination
  ): Promise<APIResponse<IAssessDestination>> {
    if (!assess.traveller_id || !assess.destination_id || assess.no == null) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "missing traveller_id, destination_id or no",
        error: true,
      };
    }

    assess.updated_at = new Date();

    const result = await assessDestinationModel.updateOne(assess);
    if (!result) {
      return {
        status: STATUS.NOT_FOUND,
        message: "Review not found or not updated",
        error: true,
      };
    }

    return { status: STATUS.OK, message: "Successfully updated", data: result };
  },

  async deleteOne(
    travellerId: string | undefined,
    destinationId: string | undefined,
    no: number | undefined
  ): Promise<APIResponse<null>> {
    if (!travellerId || !destinationId || no == null) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "missing traveller_id, destination_id or no",
        error: true,
      };
    }

    const success = await assessDestinationModel.deleteOne(
      travellerId,
      destinationId,
      no
    );

    if (!success) {
      return {
        status: STATUS.NOT_FOUND,
        message: "Review not found or already deleted",
        error: true,
      };
    }

    return { status: STATUS.OK, message: "Successfully deleted" };
  },
};

export default assessDestinationService;