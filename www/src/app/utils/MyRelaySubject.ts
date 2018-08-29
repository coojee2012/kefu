import { ReplaySubject, Scheduler } from 'rxjs';


export class MyReplaySubject<T> extends ReplaySubject<T> {
	private clean = false;
	constructor(bufferSize?: number, scheduler?: Scheduler) {
		super(bufferSize, (3600000 * 24 * 365 * 100), scheduler);
	}

	clearBuffer() {
		this.clean = true;
		this.subscribe().unsubscribe();
		this.clean = false;
	}

	_getNow() {
		var t = new Date().setFullYear(3000, 1, 1);
		return this.clean ? t : super._getNow();
	}
}