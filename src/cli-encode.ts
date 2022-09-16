#!/usr/bin/env node

import { encode } from '.';

const chunk_size = 60;

let buffer = Buffer.alloc(0);

function flush() {
	let n = 0;

	for (let i = chunk_size; i < buffer.length; i += chunk_size) {
		console.log(encode(buffer.subarray(i - chunk_size, i)));

		n = i;
	}

	buffer = buffer.subarray(n - chunk_size);
}

process.stdin.on('data', (chunk: Buffer) => {
	buffer = Buffer.concat([buffer, Buffer.from(chunk)]);

	flush();
});

process.stdin.on('end', () => {
	console.log(encode(buffer));
});
