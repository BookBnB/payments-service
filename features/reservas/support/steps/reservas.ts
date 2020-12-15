import chai from "chai";
import { Then, When, World } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
import { TipoEvento } from '../../../../src/domain/common/servicios/IServicioCore';
import { esperarA } from '../../../util/utils';
import Reservas from '../Reservas';

chai.use(sinonChai)
const expect = chai.expect;

async function crearReserva(this: any, datos: { idUsuario: string, fechaInicio: string, fechaFin: string }) {
    this.datosReserva = {
        idReserva: uuid(),
        idPublicacionContrato: 0,
        idUsuario: datos.idUsuario,
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
                idReserva: contexto.datosReserva.idReserva,
                fechaInicio: contexto.datosReserva.fechaInicio,
                fechaFin: contexto.datosReserva.fechaFin
            }
        })
    }, this)
}

When('el usuario {string} crea una reserva del {string} al {string}', async function (id, fechaInicio, fechaFin) {
    await crearReserva.bind(this)({ idUsuario: id, fechaInicio, fechaFin })
});

When('el usuario {string} crea exitosamente una reserva del {string} al {string}', async function (id, fechaInicio, fechaFin) {
    await crearReserva.bind(this)({ idUsuario: id, fechaInicio, fechaFin })
    await esperarEventoCreacionReserva.bind(this)()
});

When('el anfitrion {string} aprueba la reserva del usuario {string}', async function (idAnfitrion, idHuesped) {
    this.datosAprobacion = {
        idReserva: this.datosReserva.idReserva,
        idPublicacionContrato: this.datosReserva.idPublicacionContrato,
        idAnfitrion,
        idHuesped,
        fechaInicio: this.datosReserva.fechaInicio,
        fechaFin: this.datosReserva.fechaFin
    }

    await Reservas.aprobar(this, this.datosAprobacion)
});

When('el anfitrion {string} rechaza la reserva del usuario {string}', async function (idAnfitrion, idHuesped) {
    this.datosRechazo = {
        idReserva: this.datosReserva.idReserva,
        idPublicacionContrato: this.datosReserva.idPublicacionContrato,
        idAnfitrion,
        idHuesped,
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
            idReserva: this.datosReserva.idReserva,
            fechaInicio: this.datosReserva.fechaInicio,
            fechaFin: this.datosReserva.fechaFin
        }
    })
})

Then('se emite un evento de aceptacion de la reserva', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    await esperarA(function (contexto) {
        return contexto.mockServicioCore.notificar.calledWith({
            tipo: TipoEvento.RESERVA_ACEPTADA,
            payload: {
                idReserva: contexto.datosAprobacion.idReserva,
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
                idReserva: contexto.datosRechazo.idReserva,
                fechaInicio: contexto.datosRechazo.fechaInicio,
                fechaFin: contexto.datosRechazo.fechaFin
            }
        })
    }, this)
})
