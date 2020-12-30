import chai from "chai";
import { Then, When } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
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

Then('se emite un evento de creación de la reserva fallida', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarCreacionDeReservaFallida.calledWithMatch({
            id: contexto.datosReserva.reservaId
        })
    }, this)
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

Then('se emite un evento de rechazo de reserva fallida', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarRechazoDeReservaFallida.calledWithMatch({
            id: contexto.datosReserva.reservaId
        })
    }, this)
});
