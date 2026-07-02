const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const { join } = require('node:path');
const { test } = require('node:test');

const cli_encode = join(__dirname, '..', 'lib', 'cli-encode.js');
const cli_decode = join(__dirname, '..', 'lib', 'cli-decode.js');

function run(script, chunks) {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [script], {
			stdio: ['pipe', 'pipe', 'inherit'],
		});

		const out = [];

		child.stdout.on('data', (chunk) => out.push(chunk));
		child.on('error', reject);
		child.on('close', (code) =>
			code === 0
				? resolve(Buffer.concat(out))
				: reject(new Error(`${script} exited with code ${code}`)),
		);

		for (const chunk of chunks) {
			child.stdin.write(chunk);
		}

		child.stdin.end();
	});
}

test('CLI round trip preserves multi-chunk input', async () => {
	const input = randomBytes(5000);
	const chunks = [
		input.subarray(0, 1500),
		input.subarray(1500, 3000),
		input.subarray(3000),
	];

	const encoded = await run(cli_encode, chunks);
	const decoded = await run(cli_decode, [encoded]);

	assert.deepEqual(decoded, input);
});

test('base64-decode accepts padded standard base64', async () => {
	const input = randomBytes(250);
	const padded = input.toString('base64');

	const decoded = await run(cli_decode, [padded]);

	assert.deepEqual(decoded, input);
});

test('base64-decode accepts MIME-wrapped base64', async () => {
	const input = randomBytes(300);
	const wrapped = input.toString('base64').replace(/(.{76})/g, '$1\r\n');

	const decoded = await run(cli_decode, [wrapped]);

	assert.deepEqual(decoded, input);
});
