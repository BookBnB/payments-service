import chai from "chai";
import { Then, When, World } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
import { TipoEvento } from '../../../../src/domain/common/servicios/IServicioCore';
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
        return contexto.mockServicioCore.notificar.calledWith({
            tipo: TipoEvento.NUEVA_RESERVA,
            payload: {
                reservaId: contexto.datosReserva.reservaId,
                fechaInicio: contexto.datosReserva.fechaInicio,
                fechaFin: contexto.datosReserva.fechaFin
            }
        })
    }, this)
}

When('el usuario {string} crea una reserva del {string} al {string}', async function (id, fechaInicio, fechaFin) {
    await crearReserva.bind(this)({ usuarioId: id, fechaInicio, fechaFin })
});

When('el usuario {string} crea exitosamente una reserva del {string} al {string}', async function (id, fechaInicio, fechaFin) {
    await crearReserva.bind(this)({ usuarioId: id, fechaInicio, fechaFin })
    await esperarEventoCreacionReserva.bind(this)()
});

When('el anfitrión {string} aprueba la reserva del usuario {string}', async function (anfitrionId, huespedId) {
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

When('el anfitrión {string} rechaza la reserva del usuario {string}', async function (anfitrionId, huespedId) {
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

Then('se emite un evento para la nueva reserva', async function () {
    await esperarEventoCreacionReserva.bind(this)()
});

Then('no se emite un evento para la nueva reserva', async function () {
    expect(this.mockServicioCore.notificar).to.not.have.been.calledWith({
        tipo: TipoEvento.NUEVA_RESERVA,
        payload: {
            reservaId: this.datosReserva.reservaId,
            fechaInicio: this.datosReserva.fechaInicio,
            fechaFin: this.datosReserva.fechaFin
        }
    })
})

Then('se emite un evento de aceptación de la reserva', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificar.calledWith({
            tipo: TipoEvento.RESERVA_ACEPTADA,
            payload: {
                reservaId: contexto.datosAprobacion.reservaId,
                fechaInicio: contexto.datosAprobacion.fechaInicio,
                fechaFin: contexto.datosAprobacion.fechaFin
            }
        })
    }, this)
})

Then('se emite un evento de rechazo de la reserva', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificar.calledWith({
            tipo: TipoEvento.RESERVA_RECHAZADA,
            payload: {
                reservaId: contexto.datosRechazo.reservaId,
                fechaInicio: contexto.datosRechazo.fechaInicio,
                fechaFin: contexto.datosRechazo.fechaFin
            }
        })
    }, this)
})
