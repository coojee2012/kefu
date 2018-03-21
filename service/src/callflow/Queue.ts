import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { Queue as BullQueue } from 'bull';
import { QueueWorkerService } from './QueueWorkerService';

@Injectable()
export class Queue {
    private queueWorker:QueueWorkerService;
    constructor(private injector: Injector) {
        this.queueWorker = this.injector.get(QueueWorkerService);
       // this.queueWorker.add('');
    }
}