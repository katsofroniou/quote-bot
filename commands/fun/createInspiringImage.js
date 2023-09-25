const { createCanvas, loadImage } = require('canvas');

async function createInspiringImage(quote, author, imageUrl) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    const image = await loadImage(imageUrl);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const quoteFontSize = 30;
    ctx.font = `${quoteFontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    const maxTextWidth = canvas.width - 40;

    const words = quote.split(' ');
    let line = '';
    const lines = [];
    for (const word of words) {
        const testLine = line + word + ' ';
        const { width } = ctx.measureText(testLine);
        if (width < maxTextWidth) {
            line = testLine;
        } else {
            lines.push(line);
            line = `${word} `;
        }
    }
    lines.push(line);

    const quoteX = canvas.width / 2;
    let quoteY = 30;

    // Draw each line of the quote
    for (const line of lines) {
        ctx.fillText(line, quoteX, quoteY);
        quoteY += quoteFontSize + 10;
    }

    const authorFontSize = 20;
    ctx.font = `${authorFontSize}px Arial`;

    const authorX = 50;
    const authorY = canvas.height - 20;

    ctx.fillText(`- ${author}`, authorX, authorY);

    return canvas.toBuffer();
}

module.exports = {
    createInspiringImage,
};
