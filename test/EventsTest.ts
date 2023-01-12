import {Events} from "@src/Events";
import {assert, IsExact} from "conditional-type-checks";
import * as sinon from 'sinon';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type EventsMap = {
	progress: [number],
	abort: [],
	complete: [Record<string, unknown>, number]
}

const PROGRESS = 100;
describe('Events', () => {
	let events: Events<EventsMap>;

	beforeEach(() => {
		events = new Events<EventsMap>();
	});

	describe('on', () => {
		it('adds listener', () => {
			const spy1 = sinon.spy();
			const spy2 = sinon.spy();

			events.on('progress', spy1);
			events.on('progress', spy2);

			events.emit('progress', PROGRESS);

			sinon.assert.calledWith(spy1, PROGRESS);
			sinon.assert.calledWith(spy2, PROGRESS);
		});
	});

	describe('off', () => {
		it('removes listener', () => {
			const spy1 = sinon.spy();
			const spy2 = sinon.spy();

			events.on('progress', spy1);
			events.on('progress', spy2);
			events.off('progress', spy2);

			events.emit('progress', PROGRESS);

			sinon.assert.calledWith(spy1, PROGRESS);
			sinon.assert.notCalled(spy2);
		});
	});

	describe('emit', () => {
		it('dispatches event', () => {
			const spy1 = sinon.spy();
			const spy2 = sinon.spy();

			events.on('progress', spy1);
			events.on('progress', spy2);

			events.emit('progress', PROGRESS);

			sinon.assert.callOrder(spy1, spy2);
		});

		it('ignores event if there are no listeners', () => {
			events.emit('progress', PROGRESS);
		});

		it('dispatches event only for listeners for given event name', () => {
			const spy1 = sinon.spy();
			const spy2 = sinon.spy();

			events.on('progress', spy1);
			events.on('complete', spy2);

			events.emit('progress', PROGRESS);
			sinon.assert.calledWith(spy1, PROGRESS);
			sinon.assert.notCalled(spy2);
		});
	})

	describe('types', () => {
		describe('progress', () => {
			it('on', () => {
				type Input = Parameters<typeof events.on<'progress'>>;
				type Expected = ['progress', (...args: [number]) => unknown];
				assert<IsExact<Input, Expected>>(true);
			});

			it('off', () => {
				type Input = Parameters<typeof events.off<'progress'>>;
				type Expected = ['progress', (...args: [number]) => unknown];
				assert<IsExact<Input, Expected>>(true);
			});

			it('emit', () => {
				type Input = Parameters<typeof events.emit<'progress'>>;
				type Expected = ['progress', number];
				assert<IsExact<Input, Expected>>(true);
			});
		});

		describe('complete', () => {
			it('on', () => {
				type Input = Parameters<typeof events.on<'complete'>>;
				type Expected = ['complete', (...args: [Record<string, unknown>, number]) => unknown];
				assert<IsExact<Input, Expected>>(true);
			});

			it('off', () => {
				type Input = Parameters<typeof events.off<'complete'>>;
				type Expected = ['complete', (...args: [Record<string, unknown>, number]) => unknown];
				assert<IsExact<Input, Expected>>(true);
			});

			it('emit', () => {
				type Input = Parameters<typeof events.emit<'complete'>>;
				type Expected = ['complete', Record<string, unknown>, number];
				assert<IsExact<Input, Expected>>(true);
			});
		});

		describe('abort', () => {
			it('on', () => {
				type Input = Parameters<typeof events.on<'abort'>>;
				type Expected = ['abort', () => unknown];
				assert<IsExact<Input, Expected>>(true);
			});

			it('off', () => {
				type Input = Parameters<typeof events.off<'abort'>>;
				type Expected = ['abort', () => unknown];
				assert<IsExact<Input, Expected>>(true);
			});

			it('emit', () => {
				type Input = Parameters<typeof events.emit<'abort'>>;
				type Expected = ['abort'];
				assert<IsExact<Input, Expected>>(true);
			});
		});
	});
});
