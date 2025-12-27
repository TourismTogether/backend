import { db } from "../configs/db";
import { ICost } from "./cost.model";

// CẬP NHẬT: Thay thế start_location/end_location bằng 4 trường tọa độ (number)
export interface IRoute {
  id?: string;
  index: number;
  trip_id: string;
  title: string;
  description: string;
  lngStart: number; // Kinh độ điểm bắt đầu
  latStart: number; // Vĩ độ điểm bắt đầu
  lngEnd: number; // Kinh độ điểm kết thúc
  latEnd: number; // Vĩ độ điểm kết thúc
  created_at: Date;
  updated_at: Date;
}

class RouteModel {
  // Ánh xạ tên trường từ TypeScript (camelCase) sang PostgreSQL (snake_case)
  // Dùng cho hàm updateById và select
  private static dbFieldsMap: { [key in keyof Partial<IRoute>]: string } = {
    title: "title",
    description: "description",
    index: "index",
    trip_id: "trip_id",
    lngStart: "lng_start", // Ánh xạ từ TS sang DB
    latStart: "lat_start", // Ánh xạ từ TS sang DB
    lngEnd: "lng_end", // Ánh xạ từ TS sang DB
    latEnd: "lat_end", // Ánh xạ từ TS sang DB
    created_at: "created_at",
    updated_at: "updated_at",
  };

  async findAll(): Promise<Array<IRoute>> {
    const data = await db.query<IRoute>(`
            SELECT id, index, trip_id, title, description, 
                   lng_start AS "lngStart", lat_start AS "latStart", 
                   lng_end AS "lngEnd", lat_end AS "latEnd",
                   created_at, updated_at 
            FROM routes
        `);
    return data.rows;
  }

  async findById(id: string): Promise<IRoute | undefined> {
    const data = await db.query<IRoute>(
      `
            SELECT id, index, trip_id, title, description, 
                   lng_start AS "lngStart", lat_start AS "latStart", 
                   lng_end AS "lngEnd", lat_end AS "latEnd",
                   created_at, updated_at 
            FROM routes WHERE id = $1`,
      [id]
    );
    return data.rows[0];
  }

  async createOne(route: IRoute): Promise<IRoute | undefined> {
    const query = `
            INSERT INTO routes (
                trip_id, title, index, description, 
                lng_start, lat_start, lng_end, lat_end, 
                created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;

    const values = [
      route.trip_id,
      route.title,
      route.index,
      route.description,
      route.lngStart, // Giá trị mới
      route.latStart, // Giá trị mới
      route.lngEnd, // Giá trị mới
      route.latEnd, // Giá trị mới
      route.created_at,
      route.updated_at,
    ];

    const data = await db.query<IRoute>(query, values);
    return data.rows[0];
  }

  async updateById(
    id: string,
    route: Partial<IRoute>
  ): Promise<IRoute | undefined> {
    const { id: routeId, ...fieldsToUpdate } = route;

    const keys = Object.keys(fieldsToUpdate) as Array<keyof Partial<IRoute>>;
    if (keys.length === 0) return undefined;

    // Tạo SET clause với tên cột DB và ánh xạ
    const setClause = keys
      .map((key, idx) => `${RouteModel.dbFieldsMap[key]} = $${idx + 2}`)
      .join(", ");
    const values = Object.values(fieldsToUpdate);
    values.unshift(id);

    const query = `
            UPDATE routes
            SET ${setClause}
            WHERE id = $1
            RETURNING *;
        `;

    const data = await db.query<IRoute>(query, values);
    return data.rows[0];
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await db.query(
      `
            DELETE FROM routes WHERE id = $1
            `,
      [id]
    );
    return result.rowCount == null || result.rowCount > 0;
  }

  async deleteByTripId(trip_id: string): Promise<boolean> {
    const result = await db.query(
      `
            DELETE FROM routes WHERE trip_id = $1
            `,
      [trip_id]
    );
    return result.rowCount == null || result.rowCount > 0;
  }

  async findListCost(id: string): Promise<Array<ICost>> {
    const query = `
            SELECT c.*
            FROM routes AS r
            JOIN costs AS c ON c.route_id = r.id
            WHERE r.id = $1
        `;
    const values = [id];
    const data = await db.query(query, values);
    return data.rows;
  }
}

export const routeModel = new RouteModel();
