import {After, AfterAll, Before, BeforeAll, World} from "cucumber";
import express from "express"
import Api from "../src/app/Api";
import Log4JSLogger from "../src/infra/logging/Logger";
import {DIContainer} from "@wessberg/di";
import {Connection} from "typeorm";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import Registry from "../src/infra/container/Registry";
import Web3 from "web3";
import { configure } from "log4js";
import logConfig from "../config/log-config.json";
import { HTTPErrorHandlerLogger, HTTPLogger } from "../src/infra/logging/HTTPLogger";
import { abi as BookBnBABI, bytecode as BookBnBBytecode } from "../src/contracts/BnBooking.json"

dotenvExpand(dotenv.config({path: 'features/.env'}))

BeforeAll(() => {
    if(process.env["LOGS"] === 'true') configure(logConfig);
})

async function setupWeb3(context: World) {
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

    context.web3 = web3
}

async function setupApi(context: World) {
    const app = express()
    context.app = app
    context.container = new DIContainer()
    await new Registry().registrar(context.container);
        
    const logger = new Log4JSLogger('Tests')
    new HTTPLogger({app, logger})

    new Api({
        app,
        logger: new Log4JSLogger('Api'),
        container: context.container,
    });

    new HTTPErrorHandlerLogger({app, logger})
}

async function takeSnapshot(context: World) {
    context.snapshotActual = await context.web3.evm.snapshot()
}

async function deployContract(context: World) {
    let contract = new context.web3.eth.Contract(BookBnBABI)

    const deployerAddress = context.web3.eth.defaultAccount;

    const deployTx = await contract.deploy({
        data: BookBnBBytecode,
        arguments: [1, deployerAddress]
    })

    contract = await deployTx.send({
        from: deployerAddress,
        gasPrice: await context.web3.eth.getGasPrice(),
        gas: await deployTx.estimateGas()
    })

    process.env.CONTRACT_ADDRESS = contract.options.address
}

async function closeContainer(context: World) {
    const container: DIContainer = context.container
    return await container.get<Connection>().close()
}

async function revertSnapshot(context: World) {
    await context.web3.evm.revert(context.snapshotActual)
}

Before(async function () {
    await setupWeb3(this)
    await takeSnapshot(this)
    await deployContract(this)
    await setupApi(this)
});

After(async function () {
    await closeContainer(this)
    await revertSnapshot(this)
});
