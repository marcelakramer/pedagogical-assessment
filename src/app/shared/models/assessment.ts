import { Teacher } from "./teacher";

export class Assessment {
    constructor(
        public id: string,
        public teacher: Teacher,
        public rating: {}
    ) {};
};