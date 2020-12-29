import HDWalletProvider from "@truffle/hdwallet-provider";
import { DIContainer } from "@wessberg/di";
import BN from 'bn.js';
import chai from "chai";
import { Given, Then, When } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
import Web3 from "web3";
import IBilleteraRepositorio from "../../../../src/domain/billeteras/repositorios/BilleteraRepositorio";
import { billeteraActual } from "../../../billeteras/support/steps/billeteras";
import { esperarA } from '../../../util/utils';
import Reservas from '../Reservas';

chai.use(sinonChai)
const expect = chai.expect;

async function crearReserva(this: any, datos: { usuarioId: string, fechaInicio: string, fechaFin: string }) {
    this.datosReserva = {
        reservaId: uuid(),
        publicacionContratoId: 0,
        huespedId: datos.usuarioId,
        fechaInicio: new Date(datos.fechaInicio).toISOString(),
        fechaFin: new Date(datos.fechaFin).toISOString()
    }
    await Reservas.crear(this, this.datosReserva)
}

async function esperarEventoCreacionReserva(this: any) {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarReservaCreada.calledWithMatch({
            id: contexto.datosReserva.reservaId
        })
    }, this)
}

Given('que me quedan {float} ethers en mi billetera', async function (fondos) {
    const container: DIContainer = this.container
    const repoBilleteras: IBilleteraRepositorio = container.get<IBilleteraRepositorio>()

    const billeteraDTO = billeteraActual.bind(this)()
    const billetera = await repoBilleteras.obtener(billeteraDTO.usuarioId)

    const web3Usuario = new Web3(
        new HDWalletProvider(billetera.palabras, process.env.NODE_URL)
    )

    // vaciamos la billetera
    const gasTransferencia = new BN(21000)
    const gasPrice = new BN(await web3Usuario.eth.getGasPrice())
    const fee = gasTransferencia.mul(gasPrice)

    const balanceActual = new BN(await web3Usuario.eth.getBalance(billeteraDTO.direccion))
    await web3Usuario.eth.sendTransaction({
        from: billetera.direccion,
        to: this.web3.eth.defaultAccount,
        value: balanceActual.sub(fee)
    })

    // recargamos con los fondos deseados
    const saldoRestante = new BN(await this.web3.utils.toWei(fondos.toString()))
    await this.web3.eth.sendTransaction({
        to: billetera.direccion,
        value: saldoRestante
    })

    const saldoActual = new BN(await this.web3.eth.getBalance(billetera.direccion))
    expect(saldoActual).to.eql(saldoRestante)
});

Given('que al usuario con email {string} le quedan {float} ethers en su billetera', async function (email, fondosRestantes) {

});

When('creo una reserva del {string} al {string}', async function (fechaInicio, fechaFin) {
    await crearReserva.bind(this)({
        usuarioId: this.usuarios.get(this.emailUsuarioActual),
        fechaInicio,
        fechaFin
    })
});

When(/^(?:que )el usuario con email '([^']*)' crea exitosamente una reserva del '([^']*)' al '([^']*)'$/, async function (email, fechaInicio, fechaFin) {
    const usuarioId = this.usuarios.get(email)
    await crearReserva.bind(this)({usuarioId: usuarioId, fechaInicio, fechaFin})
    await esperarEventoCreacionReserva.bind(this)()
});

When('apruebo la reserva del usuario con email {string}', async function (huespedEmail) {
    const anfitrionId = this.usuarios.get(this.emailUsuarioActual)
    const huespedId = this.usuarios.get(huespedEmail)

    this.datosAprobacion = {
        reservaId: this.datosReserva.reservaId,
        publicacionContratoId: this.datosReserva.publicacionContratoId,
        anfitrionId,
        huespedId,
        fechaInicio: this.datosReserva.fechaInicio,
        fechaFin: this.datosReserva.fechaFin
    }

    await Reservas.aprobar(this, this.datosAprobacion)
});

When('rechazo la reserva del usuario con email {string}', async function (huespedEmail) {
    const anfitrionId = this.usuarios.get(this.emailUsuarioActual)
    const huespedId = this.usuarios.get(huespedEmail)
    this.datosRechazo = {
        reservaId: this.datosReserva.reservaId,
        publicacionContratoId: this.datosReserva.publicacionContratoId,
        anfitrionId,
        huespedId,
        fechaInicio: this.datosReserva.fechaInicio,
        fechaFin: this.datosReserva.fechaFin
    }

    await Reservas.rechazar(this, this.datosRechazo)
});

Then('se emite un evento de confirmación de la creación de la nueva reserva', async function () {
    await esperarEventoCreacionReserva.bind(this)()
});

Then('se emite un evento de aceptación de la reserva', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarReservaAprobada.calledWithMatch({
            id: contexto.datosAprobacion.reservaId
        })
    }, this)
})

Then('se emite un evento de rechazo de la reserva', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarReservaRechazada.calledWithMatch({
            id: contexto.datosReserva.reservaId
        })
    }, this)
})

Then('se emite un evento de aprobación de reserva fallida', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarAprobacionDeReservaFallida.calledWithMatch({
            id: contexto.datosReserva.reservaId
        })
    }, this)
})
