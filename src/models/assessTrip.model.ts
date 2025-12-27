import { db } from "../configs/db";

export interface IAssessTrip {
  traveller_id: string;
  trip_id: string;
  rating_star: number;
  comment?: string;
  created_at?: Date;
  updated_at?: Date;
}

class AssessTripModel {
  async findByTripId(tripId: string): Promise<IAssessTrip[]> {
    const data = await db.query<IAssessTrip>(
      "SELECT * FROM assess_trip WHERE trip_id = $1",
      [tripId]
    );
    return data.rows;
  }

  async createOne(assess: IAssessTrip): Promise<IAssessTrip | undefined> {
    const query = `
            INSERT INTO assess_trip (
                traveller_id, trip_id, rating_star, comment, created_at, updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *;
        `;
    const values = [
      assess.traveller_id,
      assess.trip_id,
      assess.rating_star,
      assess.comment,
      assess.created_at,
      assess.updated_at,
    ];
    const data = await db.query<IAssessTrip>(query, values);
    return data.rows[0];
  }

  async updateOne(assess: IAssessTrip): Promise<IAssessTrip | undefined> {
    const query = `
            UPDATE assess_trip
            SET rating_star = $3,
                comment = $4,
                updated_at = $5
            WHERE traveller_id = $1 AND trip_id = $2
            RETURNING *;
        `;
    const values = [
      assess.traveller_id,
      assess.trip_id,
      assess.rating_star,
      assess.comment,
      assess.updated_at,
    ];
    const data = await db.query<IAssessTrip>(query, values);
    return data.rows[0];
  }

  async deleteOne(travellerId: string, tripId: string): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM assess_trip WHERE traveller_id = $1 AND trip_id = $2",
      [travellerId, tripId]
    );
    return result.rowCount != null && result.rowCount > 0;
  }

  async deleteByTripId(tripId: string): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM assess_trip WHERE trip_id = $1",
      [tripId]
    );
    return result.rowCount != null && result.rowCount >= 0;
  }
}

export const assessTripModel = new AssessTripModel();
