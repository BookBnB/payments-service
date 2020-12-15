import { World } from "cucumber"

export function esperarA(fn: (c: World) => boolean, contexto: any): Promise<void> {
    return new Promise((resolve) => {
        let interval = setInterval(function () {
            if (fn(contexto)) {
                clearInterval(interval)
                resolve()
            }
        }, 200)
    })
}
