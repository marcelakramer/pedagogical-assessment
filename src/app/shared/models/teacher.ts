import { AssessmentRating } from "../interfaces/assessment-rating";
import { Teaching } from "./teaching";

export class Teacher {
    constructor(
        public id: string,
        public registration: string,
        public name: string,
        public teachings: Array<Teaching>,
        public assessments: Array<AssessmentRating>
    ) {};
};