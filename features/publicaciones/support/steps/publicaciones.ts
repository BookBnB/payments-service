import chai from "chai";
import { Given, Then, When } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
import { TipoEvento } from '../../../../src/domain/common/servicios/IServicioCore';
import Billeteras from '../../../billeteras/support/Billeteras';
import { sleep } from '../../../util/utils';
import Publicaciones from '../Publicaciones';

chai.use(sinonChai)
const expect = chai.expect;

Given('que el usuario {string} tiene una billetera con {int} ethers', async function (id, montoEth) {
    await Billeteras.crear(this, id);
    
    this.billetera = this.last_response.body

    const montoWei = this.web3.utils.toWei(montoEth.toString())

    await this.web3.eth.sendTransaction({
        to: this.billetera.direccion,
        value: montoWei
    })

    const balance = await this.web3.eth.getBalance(this.billetera.direccion)
    expect(balance).to.eq(montoWei)
});

When('creo una publicacion con precio por noche {float} eth', async function (precioPorNoche) {
    this.datosPublicacion = {
        id: uuid(),
        precioPorNoche: precioPorNoche
    }
    await Publicaciones.crear(this, this.datosPublicacion.id, this.billetera.idUsuario, precioPorNoche)
});

Then('se emite un evento para la nueva publicacion', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    // TODO: mejorar la forma en la que se espera a que suceda el evento asincrónico
    await sleep(500)

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

Then('veo un error {string}', function (message) {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json
    expect(this.last_response.body).to.have.property('message').to.be.equal(message)
})
