const axios = require("axios");

async function getRandomImage() {
    const accessKey = process.env.UNSPLASH_ACCESS;
    const apiUrl = 'https://api.unsplash.com/photos/random';

    try {
        const response = await axios.get(apiUrl, {
            params: {
                query: 'inspirational',
                count: 1,
                client_id: accessKey,
            },
        });

        const imageUrl = response.data[0].urls.regular;
        const photographerName = response.data[0].user.name;
        const unsplashPostUrl = response.data[0].links.html;

        return { imageUrl, photographerName, unsplashPostUrl };

    } catch (error) {
        console.error('Error fetching random image:', error);
        return null;
    }
}

module.exports = {
    getRandomImage,
};
