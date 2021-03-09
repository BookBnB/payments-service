import HDWalletProvider from "@truffle/hdwallet-provider";
import { DIContainer } from "@wessberg/di";
import BN from 'bn.js';
import chai from "chai";
import chaiHttp from "chai-http";
import { Given, TableDefinition, Then, When } from "cucumber";
import { v4 as uuid } from "uuid";
import Web3 from "web3";
import IBilleteraRepositorio from "../../../../src/domain/billeteras/repositorios/BilleteraRepositorio";
import Billeteras from "../Billeteras";

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
    return billeteraDeUsuario.bind(this)(this.emailUsuarioActual)
}

export function billeteraDeUsuario(this: any, emailUsuario: string) {
    const idUsuario = this.usuarios.get(emailUsuario)
    return this.billeteras[idUsuario]
}

async function llevarBilleteraASaldo(this: any, emailUsuario: string, fondos: number) {
    const container: DIContainer = this.container
    const repoBilleteras: IBilleteraRepositorio = container.get<IBilleteraRepositorio>()

    const billeteraDTO = billeteraDeUsuario.bind(this)(emailUsuario)
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

Given('que me quedan {float} ethers en mi billetera', async function (fondos) {
    await llevarBilleteraASaldo.bind(this)(this.emailUsuarioActual, fondos)
});

Given('que al usuario con email {string} le quedan {float} ethers en su billetera', async function (emailUsuario, fondos) {
    await llevarBilleteraASaldo.bind(this)(emailUsuario, fondos)
});

When('creo una billetera para el usuario de id {string}', async function (id: string) {
    await Billeteras.crear(this, id);
});

When('listo las billeteras', async function () {
    await Billeteras.listar(this);
});

When('ingreso a la billetera del usuario con id {string}', async function (id) {
    await Billeteras.ver(this, id)
});

function validarBilletera(this: any) {
    expect(this.last_response).to.be.json

    expect(this.last_response.body).to.have.property('usuarioId')
    expect(this.last_response.body).to.not.have.property('palabras')

    const address: string = this.last_response.body.direccion;
    expect(Web3.utils.isAddress(address)).to.be.true;
}

Then('veo una nueva billetera a nombre de dicho usuario', function () {
    expect(this.last_response).to.have.status(201)
    validarBilletera.bind(this)()
});

Then('veo una billetera a nombre de dicho usuario', function () {
    expect(this.last_response).to.have.status(200)
    validarBilletera.bind(this)()
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

Then('obtengo un error indicando que no existe', function () {
    expect(this.last_response).to.be.json
    expect(this.last_response).to.have.status(404)
    expect(this.last_response.body).to.have.property('message').to.match(/La billetera del usuario [a-zA-Z0-9-]{36} no existe/)
});

Then('veo un error indicado en el campo {string}', function (campoError: string) {
    expect(this.last_response).to.have.status(400)
    expect(this.last_response).to.be.json
    expect(campoError).to.include(this.last_response.body.errors[0].property)
});

