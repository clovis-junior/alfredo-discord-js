const BASE_URL = 'https://proclubs.ea.com/api/fc';

async function request(endpoint) {
    if (!endpoint) return;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        /*headers: {
            'Accept': 'application/json',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Referer': 'https://proclubs.ea.com/',
            'Origin': 'https://proclubs.ea.com',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        }*/
    });

    if (!response.ok)
        throw new Error(`EA FC API Error ${response.status}`);

    return response.json()
}

module.exports = {
    request
}