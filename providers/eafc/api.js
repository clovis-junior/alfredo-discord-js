const BASE_URL = 'https://proclubs.ea.com/api/fc';

async function request(endpoint) {
  if (!endpoint) return;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0'
    }
  });

  if (!response.ok)
    throw new Error(`EA FC API Error ${response.status}`);

  return response.json()
}

module.exports = {
  request
}