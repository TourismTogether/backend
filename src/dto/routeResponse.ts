import { ITrip } from "../models/trip.model"

export interface IRouteResponse {
    id?: string,
    index: number,
    trip: ITrip,
    title: string,
    description: string,
    start_location: string,
    end_location: string,
    created_at: Date,
    updated_at: Date
}