import { DIContainer } from "@wessberg/di";
import { After, Before, BeforeAll, World } from "cucumber";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { configure } from "log4js";
import sinon from "sinon";
import { Connection } from "typeorm";
import Web3 from "web3";
import logConfig from "../config/log-config.json";
import { abi as BookBnBABI, bytecode as BookBnBBytecode } from "../src/contracts/BnBooking.json";
import ServicioCore from "../src/infra/servicios/ServicioCore";
import TestRegistry from "./doubles/TestRegistry";
import app from "../src/app"
import MonitorFake from "./doubles/MonitorFake";


dotenvExpand(dotenv.config({path: 'features/.env'}))

/**
 * Setup logs
 */
BeforeAll(() => {
    if(process.env["LOGS"] === 'true') configure(logConfig);
})

/**
 * Setup contract
 */
async function setupWeb3() {
    const web3 = new Web3(
        new Web3.providers.HttpProvider(<string>process.env.NODE_URL)
    )

    web3.extend({
        property: 'evm',
        methods: [{
            name: 'snapshot',
            call: 'evm_snapshot'
        }, {
            name: 'revert',
            call: 'evm_revert',
            params: 1
        }]
    })

    web3.eth.defaultAccount = (await web3.eth.getAccounts())[0]

    return web3
}

async function takeSnapshot(web3: any) {
    return await web3.evm.snapshot()
}

async function revertSnapshot(context: World) {
    await context.web3.evm.revert(context.snapshotActual)
}

async function deployContract(web3: any) {
    let contract = new web3.eth.Contract(BookBnBABI)

    const deployerAddress = web3.eth.defaultAccount;

    const deployTx = await contract.deploy({
        data: BookBnBBytecode,
        arguments: [0, deployerAddress]
    })

    contract = await deployTx.send({
        from: deployerAddress,
        gasPrice: await web3.eth.getGasPrice(),
        gas: await deployTx.estimateGas()
    })

    process.env.CONTRACT_ADDRESS = contract.options.address
}

Before(async function () {
    const web3 = await setupWeb3()
    this.snapshotActual = await takeSnapshot(web3)
    await deployContract(web3)
    this.web3 = web3
});

After(async function () {
    await revertSnapshot(this)
});

/**
 * Setup api and mocks
 */
async function setupApp(context: World) {
    context.mockServicioCore = sinon.createStubInstance(ServicioCore)

    context.container = new DIContainer()
    await new TestRegistry(
        context.mockServicioCore,
        new MonitorFake()
    ).registrar(context.container);
    context.app = await app(context.container)
}

function setupWorldState(context: World) {
    context.billeteras = {}
    context.publicaciones = {}
    context.usuarios = new Map()
    context.reservas = new Map()
}

async function closeContainer(context: World) {
    const container: DIContainer = context.container
    return await container.get<Connection>().close()
}

async function clearSinon() {
    sinon.restore()
}

Before(async function () {
    await setupApp(this)
    setupWorldState(this)
});

After(async function () {
    await closeContainer(this)
    await clearSinon()
});
