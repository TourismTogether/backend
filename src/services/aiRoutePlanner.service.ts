// AI Route Planner Service (Backend)
// Generates complete itinerary using AI

import { APIResponse, STATUS } from "../types/response";
import { IRoute } from "../models/route.model";
import { IDestination } from "../models/destination.model";

interface AIGenerationRequest {
  destination: {
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
    category?: string;
    country?: string;
  };
  startDate: string;
  endDate: string;
  budget?: number;
  difficulty?: number;
  preferences?: string;
  existingRoutes?: any[];
}

// Extended route interface with details field
interface IRouteWithDetails extends Omit<IRoute, "id" | "created_at" | "updated_at" | "trip_id"> {
  details?: string[];
}

interface AIGeneratedRoute {
  route: IRouteWithDetails;
  reasoning?: string;
}

/**
 * Generate itinerary using local algorithm
 * This is a fallback when AI API is not available
 */
function generateLocalItinerary(request: AIGenerationRequest): AIGeneratedRoute[] {
  const { destination, startDate, endDate } = request;
  
  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const days = Math.max(1, Math.ceil(timeDiff / millisecondsPerDay));

  const routes: AIGeneratedRoute[] = [];
  const baseLat = destination.latitude;
  const baseLng = destination.longitude;

  // Generate routes for each day
  for (let day = 0; day < days; day++) {
    // Morning route
    const morningLat = baseLat + (Math.random() - 0.5) * 0.01;
    const morningLng = baseLng + (Math.random() - 0.5) * 0.01;
    const afternoonLat = baseLat + (Math.random() - 0.5) * 0.01;
    const afternoonLng = baseLng + (Math.random() - 0.5) * 0.01;

    routes.push({
      route: {
        index: day * 2,
        title: `Ngày ${day + 1} - Buổi sáng`,
        description: `Khám phá ${destination.name} vào buổi sáng. Tham quan các điểm nổi bật và thưởng thức ẩm thực địa phương.`,
        latStart: morningLat,
        lngStart: morningLng,
        latEnd: afternoonLat,
        lngEnd: afternoonLng,
        details: [
          "Tham quan điểm nổi tiếng",
          "Chụp ảnh check-in",
          "Thưởng thức bữa sáng địa phương",
        ],
      },
      reasoning: `Lộ trình buổi sáng cho ngày ${day + 1}, tối ưu để bắt đầu ngày mới với năng lượng dồi dào.`,
    });

    // Afternoon/Evening route
    const eveningLat = baseLat + (Math.random() - 0.5) * 0.01;
    const eveningLng = baseLng + (Math.random() - 0.5) * 0.01;

    routes.push({
      route: {
        index: day * 2 + 1,
        title: `Ngày ${day + 1} - Buổi chiều/Tối`,
        description: `Tiếp tục khám phá ${destination.name} vào buổi chiều và tối. Tham gia các hoạt động giải trí và thưởng thức ẩm thực.`,
        latStart: afternoonLat,
        lngStart: afternoonLng,
        latEnd: eveningLat,
        lngEnd: eveningLng,
        details: [
          "Tham quan điểm tham quan khác",
          "Mua sắm đặc sản",
          "Thưởng thức bữa tối",
          "Tham gia hoạt động giải trí",
        ],
      },
      reasoning: `Lộ trình buổi chiều/tối cho ngày ${day + 1}, cân bằng giữa tham quan và thư giãn.`,
    });
  }

  // Connect routes sequentially
  for (let i = 0; i < routes.length - 1; i++) {
    const currentRoute = routes[i];
    const nextRoute = routes[i + 1];
    if (currentRoute && nextRoute) {
      currentRoute.route.lngEnd = nextRoute.route.lngStart;
      currentRoute.route.latEnd = nextRoute.route.latStart;
    }
  }

  // Last route ends at destination
  if (routes.length > 0) {
    const lastRoute = routes[routes.length - 1];
    if (lastRoute) {
      lastRoute.route.latEnd = baseLat;
      lastRoute.route.lngEnd = baseLng;
    }
  }

  return routes;
}

const aiRoutePlannerService = {
  async generateItinerary(
    request: AIGenerationRequest
  ): Promise<APIResponse<AIGeneratedRoute[]>> {
    try {
      // For now, use local generation
      // In the future, can integrate with OpenAI or other AI services
      const routes = generateLocalItinerary(request);

      return {
        status: STATUS.OK,
        message: "Successfully generated itinerary",
        data: routes,
      };
    } catch (error: any) {
      console.error("Error generating itinerary:", error);
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to generate itinerary",
        error: true,
      };
    }
  },
};

export default aiRoutePlannerService;

