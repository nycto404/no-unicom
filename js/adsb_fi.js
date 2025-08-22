export function fetchAircraftData() {
  const url = 'https://opendata.adsb.fi/api/v2/lat/45.3179/lon/6.9496/dist/250';

  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Aircraft data:', data);
      // do something with the data
      return data;
    })
    .catch(error => {
      console.error('Failed to fetch aircraft data:', error);
    });
}

fetchAircraftData();

