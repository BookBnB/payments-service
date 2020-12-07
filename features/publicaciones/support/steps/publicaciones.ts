import { Given, When, Then } from 'cucumber'
import Billeteras from '../../../billeteras/support/Billeteras';
import Publicaciones from '../Publicaciones';
import chai from "chai"

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

When('creo una publicacion con precio por noche {int} eth', async function (precioPorNoche) {
    await Publicaciones.crear(this, this.billetera.idUsuario, precioPorNoche)
});

Then('veo que hay una publicación a mi nombre con precio por noche {int} eth', function (monto) {
    expect(this.last_response).to.have.status(201)
    expect(this.last_response).to.be.json
    
    const publicacion = this.last_response.body

    expect(publicacion.direccionAnfitrion).to.eq(this.billetera.direccion)
    expect(publicacion.precioPorNoche).to.eq(monto)
});