import { IDestination } from "../models/destination.model"

export interface ITripResponse {
    id?: string,
    destination: IDestination,
    title: string,
    description: string,
    departure: string,
    distance: number,
    start_date: Date,
    end_date: Date,
    difficult: number,
    total_budget: number,
    spent_amount: number,
    status: string,
    created_at: Date,
    updated_at: Date
}