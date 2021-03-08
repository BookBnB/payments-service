import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';
import Servidor from '../../domain/servidores/entidades/Servidor';
import ServidorInexistenteError from '../../domain/servidores/excepciones/ServidorInexistenteError';
import IServidorRepositorio from '../../domain/servidores/repositorios/ServidorRepositorio';

export default class APITokenMiddleware implements ExpressMiddlewareInterface {
    constructor(
        private readonly servidores: IServidorRepositorio
    ) {
    }

    async use(req: Request, resp: Response, next: NextFunction) {
        if (process.env.REQUIRE_API_KEY == 'false') {
            next();
            return
        }

        const token: string = req.get('x-api-token') || '';

        if (!token) throw new UnauthorizedError('Missing API key')

        try {
            const servidor: Servidor = await this.servidores.obtenerPorToken(token)
        } catch (e) {
            if (e instanceof ServidorInexistenteError) {
                throw new UnauthorizedError('Invalid API key')
            }
            throw e
        }

        next();
    }
}
