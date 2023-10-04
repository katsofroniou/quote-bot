const { createCanvas, loadImage } = require('canvas');

async function createInspiringImage(quote, author, imageUrl) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    const image = await loadImage(imageUrl);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const quoteFontSize = 30;
    ctx.font = `${quoteFontSize}px Arial`;
    ctx.fillStyle = 'white';

    const maxTextWidth = canvas.width - 20;

    const words = quote.split(' ');
    let currentLine = '';
    const lines = [];

    for (const word of words) {
        const testLine = currentLine + word + ' ';
        const { width } = ctx.measureText(testLine);

        if (width < maxTextWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = `${word} `;
        }
    }
    lines.push(currentLine);

    let textY = 30;

    for (const line of lines) {
        const lineWidth = ctx.measureText(line).width;
        const textX = (canvas.width - lineWidth) / 2;
        ctx.fillText(line, textX, textY);
        textY += quoteFontSize + 10;
    }

    const authorFontSize = 20;
    ctx.font = `${authorFontSize}px Arial`;

    const authorX = 10;
    const authorY = canvas.height - 20;

    ctx.fillText(`- ${author}`, authorX, authorY);

    return canvas.toBuffer();
}

module.exports = {
    createInspiringImage,
};