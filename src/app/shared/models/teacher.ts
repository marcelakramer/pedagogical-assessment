import { AssessmentRating } from "../interfaces/assessment-rating";

export class Teacher {
    constructor(
        public id: string,
        public registration: string,
        public name: string,
        public assessments: Array<AssessmentRating>
    ) {};
};