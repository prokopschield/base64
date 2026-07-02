const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { test } = require('node:test');

const { decode, encode } = require('../lib');

test('decode(encode(x)) round-trips inputs of lengths 0-64', () => {
	for (let length = 0; length <= 64; ++length) {
		const input = randomBytes(length);

		assert.deepEqual(
			decode(encode(input)),
			new Uint8Array(input),
			`round trip failed for ${input.toString('base64')}`,
		);
	}
});

test('encode() matches base64url with ~ in place of -', () => {
	for (let length = 0; length <= 64; ++length) {
		const input = randomBytes(length);

		assert.equal(
			encode(input),
			input.toString('base64url').replace(/-/g, '~'),
			`encode mismatch for ${input.toString('base64')}`,
		);
	}
});

test('decode() handles unpadded standard base64', () => {
	for (let length = 0; length <= 64; ++length) {
		const input = randomBytes(length);
		const unpadded = input.toString('base64').replace(/=+$/, '');

		assert.deepEqual(
			decode(unpadded),
			new Uint8Array(input),
			`decode mismatch for ${unpadded}`,
		);
	}
});

test('decode() handles URL-safe base64', () => {
	for (let length = 0; length <= 64; ++length) {
		const input = randomBytes(length);

		assert.deepEqual(
			decode(input.toString('base64url')),
			new Uint8Array(input),
			`decode mismatch for ${input.toString('base64url')}`,
		);
	}
});

test('decode() handles padded standard base64', () => {
	for (let length = 0; length <= 64; ++length) {
		const input = randomBytes(length);
		const padded = input.toString('base64');

		assert.deepEqual(
			decode(padded),
			new Uint8Array(input),
			`decode mismatch for ${padded}`,
		);
	}
});

test('decode() handles MIME-wrapped base64', () => {
	const input = randomBytes(300);
	const wrapped = input.toString('base64').replace(/(.{76})/g, '$1\r\n');

	assert.deepEqual(decode(wrapped), new Uint8Array(input));
});

test('decode("TQ==") returns [77]', () => {
	assert.deepEqual(decode('TQ=='), new Uint8Array([77]));
});
