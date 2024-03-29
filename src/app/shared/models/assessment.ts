import { AssessmentRating } from "../interfaces/assessment-rating";

export class Assessment {
    constructor(
        public id: string,
        public teacherId: string,
        public subjectId: string,
        public year: number,
        public rating: AssessmentRating
    ) {}
}