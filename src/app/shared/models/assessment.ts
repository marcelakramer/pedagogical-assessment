import { AssessmentRating } from "../interfaces/assessment-rating";

export class Assessment {
    constructor(
        public id: string,
        public teacherId: string,
        public subjectId: string,
        public datetime: Date,
        public referenceYear: number,
        public rating: AssessmentRating
    ) {}
}