import chai from "chai";
import { Then, When } from 'cucumber';
import sinonChai from "sinon-chai";
import { v4 as uuid } from "uuid";
import { TipoEvento } from '../../../../src/domain/common/servicios/IServicioCore';
import { sleep } from '../../../util/utils';
import Reservas from '../Reservas';

chai.use(sinonChai)
const expect = chai.expect;

When('el usuario {string} crea una reserva del {string} al {string}', async function (id, fechaInicio, fechaFin) {
    this.datosReserva = {
        idReserva: uuid(),
        idPublicacionContrato: 0,
        idUsuario: id,
        fechaInicio: new Date(fechaInicio).toISOString(),
        fechaFin: new Date(fechaFin).toISOString()
    }
    await Reservas.crear(this, this.datosReserva)

    // TODO: mejorar la forma en la que se espera a que suceda el evento asincrónico
    await sleep(1000)
});

Then('se emite un evento para la nueva reserva', async function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    const lastCall = this.mockServicioCore.notificar.getCall(-1)
    expect(lastCall).to.have.been.calledWith({
        tipo: TipoEvento.NUEVA_RESERVA,
        payload: {
            idReserva: this.datosReserva.idReserva,
            fechaInicio: this.datosReserva.fechaInicio,
            fechaFin: this.datosReserva.fechaFin
        }
    })
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
