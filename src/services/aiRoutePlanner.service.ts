// AI Route Planner Service (Backend)
// Generates complete itinerary using AI

import { APIResponse, STATUS } from "../types/response";
import { IRoute } from "../models/route.model";
import { IDestination } from "../models/destination.model";
import OpenAI from "openai";
import config from "../configs/config";

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


  async generateDiary({ topic, goal, audience }: { topic: string, goal: string, audience: string }) {
    const prompt = `
    Bạn là một travel diary writer chuyên nghiệp.

    Nhiệm vụ:
    - Gợi ý tiêu đề bài diary du lịch
    - Gợi ý mô tả ngắn
    - Tạo các Info Cards (thẻ thông tin)
    - Gợi ý các section nội dung cho bài diary

    Thông tin đầu vào:
    - Chủ đề: ${topic}
    - Đối tượng người đọc: ${audience}
    - Mục đích bài viết: ${goal}

    
    Yêu cầu chung:
    - Viết bằng tiếng Việt
    - Văn phong kể chuyện, cảm xúc, nhẹ nhàng
    - Ngắn gọn
    - Không dùng emoji
    - KHÔNG xuống dòng trong content
    - KHÔNG dùng dấu ngoặc kép (")
    - KHÔNG thêm bất kỳ text nào ngoài JSON

    Yêu cầu Info Cards:
    - Tạo từ 3 đến 4 card
    - Mỗi card gồm:
      - title: ngắn gọn
      - content: 1 câu ngắn, rõ ràng
    - Phù hợp để hiển thị dạng thẻ thông tin

    Yêu cầu Content Sections:
    - Tạo từ 3 đến 5 section
    - Mỗi section gồm:
      - title: ngắn gọn
      - content: 1 đoạn ngắn, mang tính kể chuyện

    Định dạng trả về:
    TRẢ VỀ DUY NHẤT 1 JSON OBJECT, KHÔNG bọc markdown, KHÔNG giải thích.

    Schema JSON BẮT BUỘC:
    {
      "title": "string",
      "shortDes": "string",
      "metadata": [
        {
          "title": "string",
          "content": "string"
        }
      ],
      "content_sections": [
        {
          "title": "string",
          "content": "string"
        }
      ]
    }
    `;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-7b-instruct",
        messages: [
          { role: "system", content: "Bạn là trợ lý viết bài." },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await res.json();

    return JSON.parse(data.choices?.[0]?.message?.content);
  }
};

export default aiRoutePlannerService;

