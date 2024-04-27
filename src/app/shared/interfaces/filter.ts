import { Subject } from "../models/subject";

export interface Filter { 
    subject: Subject | undefined,
    year: number | undefined
}