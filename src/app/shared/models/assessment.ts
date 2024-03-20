import { Subject } from "./subject";
import { Teacher } from "./teacher";

export class Assessment {
    constructor(
        public id: string,
        public teacher: Teacher,
        public subject: Subject,
        public year: number,
        public rating: {}
    ) {};
};