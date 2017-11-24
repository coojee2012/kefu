import { Injectable , Injector } from 'injection-js';
import { LoggerService } from './LogService';
@Injectable()
export class HeroService {
    constructor( private logger: LoggerService ) {
    }

    heros: Array<{ id: number; name: string }> = [
        { id: 11, name: 'Mr. Nice' },
        { id: 12, name: 'Narco' },
        { id: 13, name: 'Bombasto' },
        { id: 14, name: 'Celeritas' },
        { id: 15, name: 'Magneta' }
    ];

    getHeros() {
        this.logger.log('Fetching heros...');
        return this.heros;
    }
}
