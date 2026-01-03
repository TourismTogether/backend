import { db } from "../configs/db";

export interface IAssessDestination {
  traveller_id: string;
  destination_id: string;
  no: number;
  rating_star: number;
  comment?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

class AssessDestinationModel {
  async findByDestinationId(
    destinationId: string
  ): Promise<IAssessDestination[]> {
    const data = await db.query(
      "SELECT * FROM assess_destination WHERE destination_id = $1 ORDER BY created_at DESC",
      [destinationId]
    );
    return data.rows;
  }

  async createOne(
    assess: IAssessDestination
  ): Promise<IAssessDestination | undefined> {
    const query = `
      INSERT INTO assess_destination (
        traveller_id, destination_id, rating_star, comment, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      assess.traveller_id,
      assess.destination_id,
      assess.rating_star,
      assess.comment,
      assess.created_at || new Date(),
      assess.updated_at || new Date(),
    ];
    const data = await db.query(query, values);
    return data.rows[0];
  }

  async updateOne(
    assess: IAssessDestination
  ): Promise<IAssessDestination | undefined> {
    const query = `
      UPDATE assess_destination
      SET rating_star = $3,
          comment = $4,
          updated_at = $5
      WHERE traveller_id = $1 AND destination_id = $2 AND no = $6
      RETURNING *;
    `;
    const values = [
      assess.traveller_id,
      assess.destination_id,
      assess.rating_star,
      assess.comment,
      assess.updated_at || new Date(),
      assess.no,
    ];
    const data = await db.query(query, values);
    return data.rows[0];
  }

  async deleteOne(
    travellerId: string,
    destinationId: string,
    no: number
  ): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM assess_destination WHERE traveller_id = $1 AND destination_id = $2 AND no = $3",
      [travellerId, destinationId, no]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const assessDestinationModel = new AssessDestinationModel();