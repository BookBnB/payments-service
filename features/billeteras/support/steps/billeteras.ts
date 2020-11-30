import { Given, When, Then, TableDefinition } from "cucumber";
import chai from "chai"
import chaiHttp from "chai-http"
import Web3 from "web3";
import Billeteras from "../Billeteras";

chai.use(chaiHttp);

const expect = chai.expect;

Given('que no existen billeteras', function () {
});

When('creo una billetera para el usuario de id {string}', async function (id: string) {
    await Billeteras.crear(this, id);
});

Then('veo una billetera a nombre de dicho usuario', function () {
    expect(this.last_response).to.have.status(201)
    expect(this.last_response).to.be.json

    const address: string = this.last_response.body.direccion;
    expect(Web3.utils.isAddress(address)).to.be.true;
});

Given('el usuario de id {string} tiene una billetera', async function (id: string) {
    await Billeteras.crear(this, id);
    
    this.ids = this.ids || [];
    this.ids.push(id);
});

When('listo las billeteras', async function () {
    await Billeteras.listar(this);
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
