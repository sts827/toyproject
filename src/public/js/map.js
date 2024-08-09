navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log("latitude: ", latitude);
  console.log("longitude: ", longitude);
}

function error() {
  let msg = "Unable to retrieve your location";
}
