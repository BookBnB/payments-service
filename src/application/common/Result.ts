import {IsBoolean, IsString} from "class-validator";
import {JSONSchema} from "class-validator-jsonschema";

export default class Result {
    @IsBoolean()
    public success!: boolean

    @IsString() @JSONSchema({example: 'ok'})
    public message!: string

    constructor(success: boolean, message: string) {
        this.success = success
        this.message = message
    }

    public static success(): Result {
        return new Result(true, 'ok')
    }
}
