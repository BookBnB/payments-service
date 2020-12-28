import {Given, When, Then, TableDefinition} from "cucumber";
import chai from "chai"
import chaiHttp from "chai-http"
import Web3 from "web3";
import Billeteras from "../Billeteras";
import {v4 as uuid} from "uuid";

chai.use(chaiHttp);

const expect = chai.expect;

export async function crearBilleteraConSaldo(this: any, email: string, monto: number) {
    const id = uuid()
    this.usuarios.set(email, id)
    await Billeteras.crear(this, id);

    const billetera = this.last_response.body
    this.billeteras[billetera.usuarioId] = billetera

    const montoWei = this.web3.utils.toWei(monto.toString())

    await this.web3.eth.sendTransaction({
        to: billetera.direccion,
        value: montoWei
    })

    const balance = await this.web3.eth.getBalance(billetera.direccion)
    expect(balance).to.eq(montoWei)
}

export function billeteraActual(this: any) {
    const idUsuario = this.usuarios.get(this.emailUsuarioActual)
    return this.billeteras[idUsuario]
}

Given('que no existen billeteras', function () {
});

Given('el usuario de id {string} tiene una billetera', async function (id: string) {
    await Billeteras.crear(this, id);

    this.ids = this.ids || [];
    this.ids.push(id);
});

Given('que el usuario con email {string} tiene una billetera con {float} ethers', async function (email, saldo) {
    await crearBilleteraConSaldo.bind(this)(email, saldo)
});

Given('que soy un usuario con email {string} con una billetera con {float} ethers', async function (email, monto) {
    await crearBilleteraConSaldo.bind(this)(email, monto)
    this.emailUsuarioActual = email
});

When('creo una billetera para el usuario de id {string}', async function (id: string) {
    await Billeteras.crear(this, id);
});

When('listo las billeteras', async function () {
    await Billeteras.listar(this);
});

Then('veo una billetera a nombre de dicho usuario', function () {
    expect(this.last_response).to.have.status(201)
    expect(this.last_response).to.be.json

    const address: string = this.last_response.body.direccion;
    expect(Web3.utils.isAddress(address)).to.be.true;
});

Then('veo las billeteras de los usuarios:', function (dataTable: TableDefinition) {
    expect(this.last_response).to.have.status(200)
    expect(this.last_response).to.be.json

    const ids = dataTable.hashes();

    for (const id of ids) {
        const billetera = this.last_response.body.find((b: any) => b.id === id);
        expect(billetera).to.not.be.null;
        expect(Web3.utils.isAddress(billetera.direccion)).to.be.true
    }
});

Then('obtengo un error indicando que ya existe', function () {
    expect(this.last_response).to.be.json
    expect(this.last_response).to.have.status(409)
    expect(this.last_response.body).to.have.property('message').to.be.equal('Billetera ya existe')
});

Then('veo un error indicado en el campo {string}', function (campoError: string) {
    expect(this.last_response).to.have.status(400)
    expect(this.last_response).to.be.json
    expect(campoError).to.include(this.last_response.body.errors[0].property)
});

