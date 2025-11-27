import { db } from "../configs/db";

export interface ITrip {
    id: string,
    user_id: string,
    destination: string,
    title: string,
    description: string,
    departure: string,
    distance: number,
    start_date: Date,
    end_date: Date,
    difficult: number,
    total_bubget: number,
    spent_amount: number,
    status: string,
    created_at: Date,
    updated_at: Date
}

class TripModel {
    findAll() {

    }

    findById() {

    }

    createOne() {

    }

    updateById() {

    }

    deleteById() {
        
    }
}

export const tripModel = new TripModel();