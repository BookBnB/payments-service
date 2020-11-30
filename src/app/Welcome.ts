import {Application} from "express";

export default class Welcome {

    constructor(app: Application) {
        app.get('/', (req, res) => {
            res.status(200).send({
                status: 200,
                message: "ok"
            })
        })
    }
}
