function embedMessageInImage(imageURL, message) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();

    image.onload = function() {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      // Convert the message to binary
      const binaryMessage = message
        .split('')
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');

      const messageLength = binaryMessage.length;
      let bitIndex = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const pixel = context.getImageData(x, y, 1, 1).data;

          if (bitIndex < messageLength) {
            const bit = binaryMessage.charAt(bitIndex);
            // Set the least significant bit of each channel to the message bit
            pixel[0] = (pixel[0] & 0xfe) | Number(bit);
            pixel[1] = (pixel[1] & 0xfe) | Number(bit);
            pixel[2] = (pixel[2] & 0xfe) | Number(bit);
            context.putImageData(new ImageData(pixel, 1, 1), x, y);
            bitIndex++;
          } else {
            break;
          }
        }
      }

      // Convert the canvas image to data URL
      const modifiedImageURL = canvas.toDataURL();
      resolve(modifiedImageURL);
    };

    image.onerror = function() {
      reject(new Error('Failed to load image.'));
    };

    image.src = imageURL;
  });
}

function decodeMessageFromImage(modifiedImageURL) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);

      const binaryMessage = [];
      let bitIndex = 0;
      let byteIndex = 0;
      let messageBytes = [];
      let messageEnd = false;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const pixel = context.getImageData(x, y, 1, 1).data;

          const redBit = pixel[0] & 0x01;
          binaryMessage.push(redBit);
          bitIndex++;

          if (bitIndex % 8 === 0) {
            const byte = binaryMessage.join('');
            binaryMessage.length = 0; // Clear the array

            if (byte === '00000000') {
              messageEnd = true;
              break;
            }

            messageBytes.push(parseInt(byte, 2));
            byteIndex++;

            // Check if all message bytes have been retrieved
            if (byteIndex === messageBytes[0]) {
              messageEnd = true;
              break;
            }
          }
        }

        if (messageEnd) {
          break;
        }
      }

      if (messageEnd) {
        const originalMessage = messageBytes
          .map((byte) => String.fromCharCode(byte))
          .join('');
        resolve(originalMessage);
      } else {
        reject(new Error('No message found in the image.'));
      }
    };

    image.onerror = function() {
      reject(new Error('Failed to load image.'));
    };

    image.src = modifiedImageURL;
  });
}


module.exports={
  encode:embedMessageInImage,
  decode:decodeMessageFromImage
};



// steganogarphy.decode(newURL).then((originalMessage) => {
//   console.log('Original Message:', originalMessage);
// })
