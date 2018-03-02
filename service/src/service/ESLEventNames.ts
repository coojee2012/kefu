import { Injector, ReflectiveInjector, Injectable } from 'injection-js';


interface IESLUserEvents {
hangup:string;
holdOn:string;
holdOff:string;
blindTransfer:string;
appointTransfer:string;
loginQueue:string;
logoffQueue:string;
}
@Injectable()
export class ESLEventNames {
    public ESLUserEvents:IESLUserEvents;
    constructor() {
        this.ESLUserEvents = {
            hangup:'esl::user::hangup',
            holdOn:'esl::user::hold::on',
            holdOff:'esl::user::hold::off',
            blindTransfer:'esl::user::transfer::blind',
            appointTransfer:'esl::user::transfer::appoint',
            loginQueue:'esl::user::queue::login',
            logoffQueue:'esl::user::queue::logoff'
        }
    }
}