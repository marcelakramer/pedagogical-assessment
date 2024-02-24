import { Teacher } from "./teacher";

export class Report {
    constructor (
        public id: string,
        public teacher: Teacher,
        public overallAverage: number,
        public specificAverages: {}
    ) {};
};