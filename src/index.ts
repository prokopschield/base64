export const alphabet =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~_';

export const reverse_items = [
	...[...alphabet].map((item, index) => [item, index]),
	['+', 62],
	['-', 62],
	[',', 63],
	['_', 63],
	['/', 63],
] as [string, number][];

export const reverse = new Map<string, number>(reverse_items);

/**
 * Convert Buffer or Uint8Array to Base-64
 * @param input Byte array being converted
 * @returns Base-64 string
 */
export function encode(input: Uint8Array) {
	let out = '';
	let mod = 0;
	let tmp = 0;
	for (const byte of input) {
		tmp += byte;
		if (mod === 0) {
			// state: 00000000 AAAAAABB
			out += alphabet[tmp >> 2];
			tmp &= 0x03;
			++mod;
		} else if (mod == 1) {
			// state: 000000BB BBBBCCCC
			out += alphabet[tmp >> 4];
			tmp &= 0x0f;
			++mod;
		} else {
			// state: 0000CCCC CCDDDDDD
			out += alphabet[tmp >> 6];
			out += alphabet[tmp & 63];
			tmp = mod = 0;
		}
		tmp <<= 8;
	}
	if (mod) out += alphabet[tmp >> (2 + mod * 2)];
	return out;
}

/**
 * Convert Base-64 to Uint8Array
 *
 * Only correctly decodes strings from encode()
 *
 * @param input Base-64 string
 * @returns Uint8Array
 */
export function decode(input: string) {
	const out = Array<number>();
	let mod = 0;
	let tmp = 0;
	let tmp_: number | undefined;
	for (const chr of input) {
		tmp_ = reverse.get(chr);
		tmp += typeof tmp_ === 'number' ? tmp_ : chr.charCodeAt(0);
		if (mod === 0) {
			// state: 00000000 00AAAAAA
		} else if (mod === 1) {
			// state: 0000AAAA AABBBBBB
			const A = tmp & 0b111111110000;
			tmp ^= A;
			out.push(A >> 4);
		} else if (mod === 2) {
			// state: 000000BB BBCCCCCC
			const B = tmp & 0b1111111100;
			tmp ^= B;
			out.push(B >> 2);
		} else if (mod === 3) {
			// state: 00000000 CCDDDDDD
			const C = tmp & 0b11111111;
			tmp ^= C;
			out.push(C);
		} else {
			// state: 00000000 00AAAAAA
			mod = 0;
		}
		tmp <<= 6;
		++mod;
	}

	tmp && out.push(tmp >> 6);

	return new Uint8Array(out);
}
