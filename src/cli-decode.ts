#!/usr/bin/env node

import { decode } from '.';

const chunk_size = 80;
const filter = /[^\w~]/g;

let buffer = String();

function flush() {
	let n = 0;

	for (let i = chunk_size; i < buffer.length; i += chunk_size) {
		process.stdout.write(decode(buffer.slice(i - chunk_size, i)));

		n = i;
	}

	buffer = buffer.slice(n - chunk_size);
}

process.stdin.on('data', (chunk: Buffer) => {
	buffer += String(chunk).replace(filter, '');

	flush();
});

process.stdin.on('end', () => {
	process.stdout.write(decode(buffer));
});
