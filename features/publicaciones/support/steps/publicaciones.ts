import chai from "chai";
import { Given, Then, When, World } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
import BilleteraDTO from "../../../../src/domain/billeteras/dtos/BilleteraDTO";
import Billeteras from '../../../billeteras/support/Billeteras';
import { esperarA } from '../../../util/utils';
import Publicaciones from '../Publicaciones';

chai.use(sinonChai)
const expect = chai.expect;

Given('que el usuario {string} tiene una billetera con {int} ethers', async function (id, montoEth) {
    await Billeteras.crear(this, id);

    const billetera = this.last_response.body
    this.billetera = billetera
    this.billeteras[billetera.usuarioId] = billetera

    const montoWei = this.web3.utils.toWei(montoEth.toString())

    await this.web3.eth.sendTransaction({
        to: billetera.direccion,
        value: montoWei
    })

    const balance = await this.web3.eth.getBalance(billetera.direccion)
    expect(balance).to.eq(montoWei)
});

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
        return contexto.mockServicioCore.notificarPublicacionCreada.calledWith(publicacionId)
    }, this)
}

Given('que el usuario {string} tiene una publicación con precio {float} eth', async function (id, precio) {
    const billetera = this.billeteras[id]
    await crearPublicacion.bind(this)(precio, billetera)
    await esperarEventoCreacionPublicacion.bind(this)(this.datosUltimaPublicacion.id)
});

When('creo una publicación con precio por noche {float} eth', async function (precioPorNoche) {
    await crearPublicacion.bind(this)(precioPorNoche, this.billetera)
});

Then('se emite un evento para la nueva publicación', async function () {
    await esperarEventoCreacionPublicacion.bind(this)(this.datosUltimaPublicacion.id)
});

Then('no se emite ningún evento', function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    expect(this.mockServicioCore.notificar).to.not.have.been.called
})
