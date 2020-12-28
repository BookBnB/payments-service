import chai from "chai";
import { Given, Then, When, World } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
import BilleteraDTO from "../../../../src/domain/billeteras/dtos/BilleteraDTO";
import { esperarA } from '../../../util/utils';
import Publicaciones from '../Publicaciones';

chai.use(sinonChai)
const expect = chai.expect;

async function crearPublicacion(this: World, precio: number, billetera: BilleteraDTO) {
    this.datosUltimaPublicacion = {
        id: uuid(),
        precioPorNoche: precio
    }
    await Publicaciones.crear(this, this.datosUltimaPublicacion.id, billetera.usuarioId, precio)
}

async function esperarEventoCreacionPublicacion(this: any, publicacionId: string) {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarPublicacionCreada.calledWithMatch({
            id: publicacionId
        })
    }, this)
}

Given('que tengo una publicación con precio {float} eth', async function (precio) {
    const idUsuario = this.usuarios.get(this.emailUsuarioActual)
    const billetera = this.billeteras[idUsuario]
    await crearPublicacion.bind(this)(precio, billetera)
    await esperarEventoCreacionPublicacion.bind(this)(this.datosUltimaPublicacion.id)
});

Given('que el usuario con email {string} tiene una publicación con precio {float} eth', async function (email, precio) {
    const idUsuario = this.usuarios.get(email)
    const billetera = this.billeteras[idUsuario]
    await crearPublicacion.bind(this)(precio, billetera)
    await esperarEventoCreacionPublicacion.bind(this)(this.datosUltimaPublicacion.id)
});

When('creo una publicación con precio por noche {float} eth', async function (precioPorNoche) {
    const idUsuario = this.usuarios.get(this.emailUsuarioActual)
    await crearPublicacion.bind(this)(precioPorNoche, this.billeteras[idUsuario])
});

Then('se emite un evento de confirmación de la nueva publicación', async function () {
    await esperarEventoCreacionPublicacion.bind(this)(this.datosUltimaPublicacion.id)
});

Then('se emite un evento de rechazo de la publicación', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarPublicacionRechazada.calledWithMatch({
            id: contexto.datosUltimaPublicacion.id
        })
    }, this)
})
