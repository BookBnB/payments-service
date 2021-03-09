import {expect} from "chai"
import {TableDefinition} from "cucumber"
import _ from "lodash";

export function validarObjeto(objeto: any, dataTable: TableDefinition) {
    Object.entries(dataTable.rowsHash()).forEach(([propiedad, valor]) => {
        expect(objeto,
            `Falla validación de propiedad '${propiedad}'. ` +
            `Se esperaba que el valor '${_.get(objeto, propiedad)}' sea igual a '${valor}'.`
        ).to.have.nested.property(propiedad).satisfy((prop: any) => prop == valor)
    })
}

export function validarConjunto(this: any, dataTable: TableDefinition, transformer?: any) {
    let objetos: any = dataTable.hashes()
    objetos = objetos.map((entrada: any) => {
        let objetoParseado: any = {}
        Object.entries(entrada).forEach(([clave, valor]) => {
            _.set(objetoParseado, clave, valor)
        })

        if (transformer) {
            objetoParseado = transformer(objetoParseado)
        }

        return {...objetoParseado}
    })
    expect(this.last_response.body).to.lengthOf(objetos.length)
    expect(this.last_response.body).to.containSubset(objetos)
}
