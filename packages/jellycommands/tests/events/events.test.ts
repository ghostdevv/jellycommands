import { event, Event } from '$src/components/events/Event';
import { describe, expect, it, vi } from 'vitest';
import { mockJellyClient } from '$mock';

declare module 'discord.js' {
	interface ClientEvents {
		testEvent: [];
	}
}

describe('events fn', () => {
	it('works', () => {
		const testEvent = event({ name: 'testEvent', async run() {} });
		expect(testEvent).toBeInstanceOf(Event);
	});

	it('has correct defaults', () => {
		const testEvent = event({ name: 'testEvent', async run() {} });
		expect(testEvent.options.disabled).toBe(false);
		expect(testEvent.options.once).toBe(false);
	});

	it('allows changing defaults', () => {
		const testEvent = event({
			name: 'testEvent',
			async run() {},
			disabled: true,
			once: true,
		});
		expect(testEvent.options.disabled).toBe(true);
		expect(testEvent.options.once).toBe(true);
	});

	it('throws on incorrect options', () => {
		expect(() => event({ run() {} } as any)).toThrowError();
		expect(() => event({ name: 'testEvent' } as any)).toThrowError();
		expect(() => event({ name: 123 } as any)).toThrowError();

		expect(() => event({ run: 123 } as any)).toThrowError();
		expect(() => event({} as any)).toThrowError();

		expect(() => event({ disabled: 123 } as any)).toThrowError();
	});

	it('should have equal names', () => {
		const testEvent = event({ name: 'testEvent', async run() {} });
		expect(testEvent.name).toBe(testEvent.options.name);
	});
});

// describe('registers events', () => {
//     it('should register on and once events', async () => {
//         const client = mockJellyClient();
//         const once = vi.spyOn(client, 'once');
//         const on = vi.spyOn(client, 'on');

//         await registerEvents(client, [
//             event({ name: 'testEvent', async run() {} }),
//             event({ name: 'testEvent', async run() {}, once: true }),
//         ]);

//         expect(on).toHaveBeenCalled();
//         expect(once).toHaveBeenCalledTimes(1);
//     });

//     it('should ignore events that are disabled', async () => {
//         const client = mockJellyClient();
//         const once = vi.spyOn(client, 'once');
//         const on = vi.spyOn(client, 'on');

//         await registerEvents(client, [
//             event({ name: 'testEvent', async run() {} }),
//             event({ name: 'testEvent', async run() {}, disabled: true }),
//         ]);

//         expect(on).toHaveBeenCalled();
//         expect(once).not.toHaveBeenCalled();
//     });

//     it('should fire event', async () => {
//         const client = mockJellyClient();

//         const run = vi.fn();
//         await registerEvents(client, [event({ name: 'debug', run })]);

//         client.emit('debug', 'test');
//         client.emit('debug', 'test');

//         expect(run).toHaveBeenCalledTimes(2);
//     });

//     it('should handle once events correctly', async () => {
//         const client = mockJellyClient();

//         const run = vi.fn();
//         await registerEvents(client, [event({ name: 'testEvent', run: run, once: true })]);

//         client.emit('testEvent');
//         client.emit('testEvent');
//         client.emit('testEvent');

//         expect(run).toHaveBeenCalledOnce();
//         expect(client.listeners('testEvent').length).toBe(0);
//     });

//     it('throws if an invalid event is passed', async () => {
//         const client = mockJellyClient();

//         expect(() =>
//             registerEvents(client, [
//                 // @ts-expect-error invalid item
//                 1234,
//             ]),
//         ).rejects.toThrowError();
//     });

//     it('logs an error if the event throws at runtime', async () => {
//         const error = vi.spyOn(console, 'error').mockImplementation(() => void 0);
//         const client = mockJellyClient();

//         await registerEvents(client, [
//             event({
//                 name: 'testEvent',
//                 run() {
//                     throw new Error('failed!');
//                 },
//             }),
//         ]);

//         client.emit('testEvent');

//         expect(error).toHaveBeenCalledTimes(1);
//     });
// });
