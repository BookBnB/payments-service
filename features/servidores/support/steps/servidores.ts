import chai from "chai";
import {Given, TableDefinition, Then, When} from 'cucumber';
import sinonChai from "sinon-chai";
import Servidores from "../Servidores";

chai.use(sinonChai)
const expect = chai.expect;

Given('que soy administrador del sistema', function () {
});

Given('que existe un servidor con nombre {string}', async function (nombre) {
    await Servidores.crear(this, nombre)
})

Given('que bloqueo el servidor de nombre {string}', async function (nombre) {
    await Servidores.bloquear(this, nombre)
});

When('creo un servidor con nombre {string}', async function (nombre) {
    await Servidores.crear(this, nombre)
});

When('listo los servidores', async function () {
    await Servidores.listar(this)
});

When('bloqueo el servidor de nombre {string}', async function (nombre) {
    await Servidores.bloquear(this, nombre)
});

When('desbloqueo el servidor de nombre {string}', async function (nombre) {
    await Servidores.desbloquear(this, nombre)
});

Then('veo un nuevo servidor con nombre {string}, token y id', function (nombre) {
    expect(this.last_response).to.have.status(201)
    expect(this.last_response).to.be.json
    expect(this.last_response.body.nombre).to.eq(nombre)
    expect(this.last_response.body.token).to.be.ok
    expect(this.last_response.body.id).to.be.ok
});

Then('no veo {string}', function (_) {
    expect(this.last_response.body).to.eql([])
});

Then('veo que el servidor está bloqueado', function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json
    expect(this.last_response.body.bloqueado).to.true
});

Then('veo que el servidor está desbloqueado', function () {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json
    expect(this.last_response.body.bloqueado).to.false
});
