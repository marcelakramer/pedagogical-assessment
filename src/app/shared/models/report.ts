export class Report {
    constructor (
        public id: string,
        public teacherid: string,
        public overallAverage: number,
        public specificAverages: object
    ) {}
}