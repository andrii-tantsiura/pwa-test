import { useCallback, useEffect, useState } from "react";

import logo from "./logo.svg";
import "./App.css";

const VIBRATION_PATTERN = [
  100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100,
];

function App() {
  const [coords, setCoords] = useState<GeolocationCoordinates | undefined>();
  const [locationSearchUrl, setLocationSearchUrl] = useState<
    string | undefined
  >();

  const fetchCurrentPosition = useCallback(async () => {
    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    if (permission.state === "granted") {
      navigator.geolocation.getCurrentPosition(({ coords }) =>
        setCoords(coords)
      );
    } else if (permission.state === "prompt") {
      // showButtonToEnableLocalNews();
    } else {
      // alert("Location permissions denied");
    }
  }, []);

  const handleShare = () => {
    const sharedLocation = {
      text: "Share my location",
      title: "Share",
      url: locationSearchUrl,
    };

    if (navigator.canShare(sharedLocation)) {
      navigator.share(sharedLocation);
    } else {
      alert("Cannot share location");
    }
  };

  const handleCopy = () => {
    if (locationSearchUrl) {
      navigator.clipboard.writeText(locationSearchUrl);
    }
  };

  const handleChangeBadgeNumber = () => (navigator as any)?.setAppBadge(9);

  const handleVibrate = () => navigator.vibrate(VIBRATION_PATTERN);

  useEffect(() => {
    setLocationSearchUrl(
      `https://www.google.com/search?q=${coords?.latitude}+${coords?.longitude}`
    );
  }, [coords?.latitude, coords?.longitude]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button onClick={fetchCurrentPosition}>Get my location</button>

        <button onClick={handleChangeBadgeNumber}>Set app badge 9</button>

        <button onClick={handleVibrate}>Vibrate SOS</button>

        {coords && (
          <>
            <p>
              My location: {coords.latitude}, {coords.longitude}
            </p>

            <a
              className="App-link"
              href={locationSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Google Maps
            </a>

            <button onClick={handleShare}>Share my location</button>

            <button onClick={handleCopy}>Copy</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
