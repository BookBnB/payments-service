export default class Result {
    public success!: boolean
    public message!: string

    constructor(success: boolean, message: string) {
        this.success = success
        this.message = message
    }

    public static success(): Result {
        return new Result(true, 'ok')
    }
}
