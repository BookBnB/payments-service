import chai from "chai";
import { Given, Then, When, World } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
import BilleteraDTO from "../../../../src/domain/billeteras/dtos/BilleteraDTO";
import { TipoEvento } from '../../../../src/domain/common/servicios/IServicioCore';
import Billeteras from '../../../billeteras/support/Billeteras';
import { sleep } from '../../../util/utils';
import Publicaciones from '../Publicaciones';

chai.use(sinonChai)
const expect = chai.expect;

Given('que el usuario {string} tiene una billetera con {int} ethers', async function (id, montoEth) {
    await Billeteras.crear(this, id);

    const billetera = this.last_response.body
    this.billetera = billetera
    this.billeteras[billetera.idUsuario] = billetera

    const montoWei = this.web3.utils.toWei(montoEth.toString())

    await this.web3.eth.sendTransaction({
        to: billetera.direccion,
        value: montoWei
    })

    const balance = await this.web3.eth.getBalance(billetera.direccion)
    expect(balance).to.eq(montoWei)
});

async function crearPublicacion(context: World, precio: number, billetera: BilleteraDTO) {
    context.datosPublicacion = {
        id: uuid(),
        precioPorNoche: precio
    }
    await Publicaciones.crear(context, context.datosPublicacion.id, billetera.idUsuario, precio)

    // TODO: mejorar la forma en la que se espera a que suceda el evento asincrónico
    await sleep(500)
}

Given('que el usuario {string} tiene una publicacion con precio {float} eth', async function (id, precio) {
    const billetera = this.billeteras[id]
    await crearPublicacion(this, precio, billetera)
});

When('creo una publicacion con precio por noche {float} eth', async function (precioPorNoche) {
    await crearPublicacion(this, precioPorNoche, this.billetera)
});

Then('se emite un evento para la nueva publicacion', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    expect(this.mockServicioCore.notificar).to.have.been.calledWith({
        tipo: TipoEvento.NUEVA_PUBLICACION,
        payload: {
            idPublicacion: this.datosPublicacion.id,
            precioPorNoche: this.datosPublicacion.precioPorNoche,
            direccionAnfitrion: this.billetera.direccion,
            idEnContrato: 0
        }
    })
});

Then('no se emite ningún evento', function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    expect(this.mockServicioCore.notificar).to.not.have.been.called
})
