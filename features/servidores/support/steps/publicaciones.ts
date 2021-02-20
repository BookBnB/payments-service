import chai from "chai";
import { Given, Then, When} from 'cucumber';
import sinonChai from "sinon-chai";
import Servidores from "../Servidores";

chai.use(sinonChai)
const expect = chai.expect;

Given('que soy administrador del sistema', function () {
});

When('creo un servidor con nombre {string}', async function (nombre) {
    await Servidores.crear(this, nombre)
});

Then('veo un nuevo servidor con nombre {string}, token y id', function (nombre) {
    expect(this.last_response).to.have.status(201)
    expect(this.last_response).to.be.json
    expect(this.last_response.body.nombre).to.eq(nombre)
    expect(this.last_response.body.token).to.be.ok
    expect(this.last_response.body.id).to.be.ok
});
