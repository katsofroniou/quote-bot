const {createCanvas, loadImage} = require("canvas");

async function createInspiringImage(quote, author, imageUrl) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    const image = await loadImage(imageUrl);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const quoteFontSize = 30;
    ctx.font = `${quoteFontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    const quoteX = canvas.width / 2;
    const quoteY = quoteFontSize + 20;

    ctx.fillText(`"${quote}"`, quoteX, quoteY);

    const authorFontSize = 20;
    ctx.font = `${authorFontSize}px Arial`;
    const authorX = 75;
    const authorY = canvas.height - 20;

    ctx.fillText(`- ${author}`, authorX, authorY);

    return canvas.toBuffer();
}

module.exports = {
    createInspiringImage,
}