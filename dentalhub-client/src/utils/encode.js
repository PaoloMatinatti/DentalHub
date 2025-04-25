import Pako from "pako";

function base64ToBytes(base64) {
	const binString = atob(base64);
	const bytes = new Uint8Array(binString.length);
	for (let i = 0; i < binString.length; i++) {
		bytes[i] = binString.charCodeAt(i);
	}
	return bytes;
}

function bytesToBase64(bytes) {
	let binString = "";
	for (let i = 0; i < bytes.length; i++) {
		binString += String.fromCharCode(bytes[i]);
	}
	return btoa(binString);
}

export function encodeString(data) {
	const encoder = new TextEncoder();
	return bytesToBase64(encoder.encode(data));
}

export function decodeString(data) {
	const decoder = new TextDecoder();
	return decoder.decode(base64ToBytes(data));
}

export function uncompressValue(compressedBase64) {
	if (
		compressedBase64 == "" ||
		compressedBase64 == null ||
		compressedBase64 == undefined
	)
		return { answers: null };

	const compressedData = new Uint8Array(
		atob(compressedBase64)
			.split("")
			.map((char) => char.charCodeAt(0)),
	);

	const jsonString = Pako.inflate(compressedData, {
		to: "string",
	});

	const jsonData = JSON.parse(jsonString);

	return jsonData;
}
