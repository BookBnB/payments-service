import {
    Get,
    JsonController
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import Web3 from 'web3';

@OpenAPI({
    security: [{basicAuth: []}]
})

@JsonController('/payments')
export class PaymentController {
    constructor(private readonly web3: Web3) {
    }

    @Get('/')
    @OpenAPI({summary: 'Return the best block number'})
    async getAll() {
        return await this.web3.eth.getBlockNumber();
    }
}
