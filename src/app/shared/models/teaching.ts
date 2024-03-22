import { Subject } from "./subject";
import { Teacher } from "./teacher";

export class Teaching {
    constructor(
        public id: string,
        public teacher: Teacher,
        public subject: Subject,
        public firstYear: number,
        public lastYear: number
    ) {};
}