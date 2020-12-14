import { IsUUID } from "class-validator";

export default class UUID {
    @IsUUID(4)
    public id!: string

    constructor(id: string) {
        this.id = id;
    }
}