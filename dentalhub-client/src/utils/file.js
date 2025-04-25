export function dataURLToBlob(dataURL) {
	const byteString = atob(dataURL.split(",")[1]);
	const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
	const buffer = new ArrayBuffer(byteString.length);
	const intArray = new Uint8Array(buffer);

	for (let i = 0; i < byteString.length; i++) {
		intArray[i] = byteString.charCodeAt(i);
	}

	return new Blob([buffer], { type: mimeString });
}

export function blobToFile(blob, fileName) {
	return new File([blob], fileName, { type: blob.type });
}
