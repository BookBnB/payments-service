import chai from "chai";
import chaiSubset from "chai-subset";
import { Given, TableDefinition, Then, When } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
import { esperarA } from '../../../util/utils';
import { validarConjunto } from "../../../util/Validacion";
import Reservas from '../Reservas';

chai.use(sinonChai)
chai.use(chaiSubset);
const expect = chai.expect;

async function crearReserva(this: any, datos: { usuarioId: string, fechaInicio: string, fechaFin: string }) {
    this.datosReserva = {
        reservaId: uuid(),
        publicacionContratoId: 0,
        huespedId: datos.usuarioId,
        fechaInicio: new Date(datos.fechaInicio).toISOString(),
        fechaFin: new Date(datos.fechaFin).toISOString()
    }

    this.reservas.set(datos.usuarioId, this.datosReserva)

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

async function esperarEventoAprobacionReserva(this: any) {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarReservaAprobada.calledWithMatch({
            id: contexto.datosAprobacion.reservaId
        })
    }, this)
}

async function esperarEventoRechazoReserva(this: any) {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarReservaRechazada.calledWithMatch({
            id: contexto.datosRechazo.reservaId
        })
    }, this)
}

async function esperarEventoAprobacionReservaFallida(this: any) {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarAprobacionDeReservaFallida.calledWithMatch({
            id: contexto.datosAprobacion.reservaId
        })
    }, this)
}

async function esperarEventoRechazoReservaFallida(this: any) {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarRechazoDeReservaFallida.calledWithMatch({
            id: contexto.datosRechazo.reservaId
        })
    }, this)
}

async function aprobarReserva(this: any, huespedEmail: string) {
    const anfitrionId = this.usuarios.get(this.emailUsuarioActual)
    const huespedId = this.usuarios.get(huespedEmail)

    let datosReserva = this.reservas.get(huespedId)

    this.datosAprobacion = {
        reservaId: datosReserva.reservaId,
        publicacionContratoId: datosReserva.publicacionContratoId,
        anfitrionId,
        huespedId,
        fechaInicio: datosReserva.fechaInicio,
        fechaFin: datosReserva.fechaFin
    }

    await Reservas.aprobar(this, this.datosAprobacion)
}

async function rechazarReserva(this: any, huespedEmail: string) {
    const anfitrionId = this.usuarios.get(this.emailUsuarioActual)
    const huespedId = this.usuarios.get(huespedEmail)

    let datosReserva = this.reservas.get(huespedId)

    this.datosRechazo = {
        reservaId: datosReserva.reservaId,
        publicacionContratoId: datosReserva.publicacionContratoId,
        anfitrionId,
        huespedId,
        fechaInicio: datosReserva.fechaInicio,
        fechaFin: datosReserva.fechaFin
    }

    await Reservas.rechazar(this, this.datosRechazo)
}

When(/^(?:que )creo una reserva del '([^']*)' al '([^']*)'$/, async function (fechaInicio, fechaFin) {
    await crearReserva.bind(this)({
        usuarioId: this.usuarios.get(this.emailUsuarioActual),
        fechaInicio,
        fechaFin
    })
});

Given('que el usuario con email {string} crea una reserva del {string} al {string}', async function (email, fechaInicio, fechaFin) {
    await crearReserva.bind(this)({
        usuarioId: this.usuarios.get(email),
        fechaInicio,
        fechaFin
    })
});

When(/^(?:que )el usuario con email '([^']*)' crea exitosamente una reserva del '([^']*)' al '([^']*)'$/, async function (email, fechaInicio, fechaFin) {
    const usuarioId = this.usuarios.get(email)
    await crearReserva.bind(this)({usuarioId: usuarioId, fechaInicio, fechaFin})
    await esperarEventoCreacionReserva.bind(this)()
});

When(/^(?:apruebo|se aprueba) la reserva del usuario con email '([^']*)'/, async function (huespedEmail) {
    await aprobarReserva.bind(this, huespedEmail)()
});

When(/^(?:apruebo|se aprueba) con éxito la reserva del usuario con email '([^']*)'/, async function (huespedEmail) {
    await aprobarReserva.bind(this, huespedEmail)()
    await esperarEventoAprobacionReserva.bind(this)()
});

When(/^(?:apruebo|se aprueba) sin éxito la reserva del usuario con email '([^']*)'/, async function (huespedEmail) {
    await aprobarReserva.bind(this, huespedEmail)()
    await esperarEventoAprobacionReservaFallida.bind(this)()
});

When(/^(?:rechazo|se rechaza) sin éxito la reserva del usuario con email '([^']*)'/, async function (huespedEmail) {
    await rechazarReserva.bind(this, huespedEmail)()
    await esperarEventoRechazoReservaFallida.bind(this)()
});

When('rechazo la reserva del usuario con email {string}', async function (huespedEmail) {
    await rechazarReserva.bind(this)(huespedEmail)
});

When('se rechaza con éxito la reserva del usuario con email {string}', async function (huespedEmail) {
    await rechazarReserva.bind(this, huespedEmail)()
    await esperarEventoRechazoReserva.bind(this)()
});

When('el usuario con email {string} cancela su reserva del {string} al {string}', async function (huespedEmail, fechaInicio, fechaFin) {
    const anfitrionId = this.usuarios.get(this.emailUsuarioActual)
    const huespedId = this.usuarios.get(huespedEmail)
    this.datosCancelacion = {
        reservaId: this.datosReserva.reservaId,
        publicacionContratoId: this.datosReserva.publicacionContratoId,
        anfitrionId,
        huespedId,
        fechaInicio,
        fechaFin
    }

    await Reservas.cancelar(this, this.datosCancelacion)
});

When('listo las transacciones de una reserva inexistente', async function () {
    await Reservas.listarTransacciones(this, 'FALSEID')
});

When('listo las transacciones de la reserva de {string}', async function (usuarioEmail) {
    let usuarioId = this.usuarios.get(usuarioEmail)
    let reservaId = this.reservas.get(usuarioId).reservaId
    await Reservas.listarTransacciones(this, reservaId)
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
    await esperarEventoCreacionReserva.bind(this)()
})

Then('se emite un evento de rechazo de la reserva', async function () {
    await esperarEventoRechazoReserva.bind(this)()
})

Then('se emite un evento de aprobación de reserva fallida', async function () {
    await esperarEventoAprobacionReservaFallida.bind(this)()
})

Then('se emite un evento de rechazo de reserva fallida', async function () {
    await esperarEventoRechazoReservaFallida.bind(this)()
});

Then('se emite un evento de cancelación de reserva', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarReservaCancelada.calledWithMatch({
            id: contexto.datosCancelacion.reservaId
        })
    }, this)
});

Then('se emite un evento de cancelación de reserva fallida', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificarCancelacionDeReservaFallida.calledWithMatch({
            id: contexto.datosReserva.reservaId
        })
    }, this)
});

Then('obtengo un listado vacío', function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json
    expect(this.last_response.body).to.eql([])
});

Then('obtengo un listado con:', function (dataTable: TableDefinition) {
    validarConjunto.bind(this)(dataTable, (obj: any) => {
        obj.exito = obj.exito === 'true'
    })
});
