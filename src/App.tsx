import { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Image from "react-bootstrap/Image";

import logo from "./logo.svg";

import "./App.css";

const VIBRATION_PATTERN = [
  100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100,
];

const GOOGLE_QUERY_URL = "https://www.google.com/search?q=";

function App() {
  const [coords, setCoords] = useState<GeolocationCoordinates | undefined>();
  const [locationSearchUrl, setLocationSearchUrl] = useState<
    string | undefined
  >();

  const fetchCurrentPosition = useCallback(async () => {
    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    console.log("location permission:", permission.state);

    navigator.geolocation.getCurrentPosition(({ coords }) => setCoords(coords));
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
      navigator.clipboard.writeText(
        `${coords?.latitude + ", " + coords?.longitude}`
      );
    }
  };

  const handleChangeBadgeNumber = () => (navigator as any)?.setAppBadge(9);

  const handleVibrate = () => navigator.vibrate(VIBRATION_PATTERN);

  useEffect(() => {
    setLocationSearchUrl(
      `${GOOGLE_QUERY_URL}${coords?.latitude}+${coords?.longitude}`
    );
  }, [coords?.latitude, coords?.longitude]);

  return (
    <div className="App">
      <header className="App-header">
        <Image src={logo} className="App-logo" alt="logo" />

        <ButtonGroup>
          <Button onClick={fetchCurrentPosition}>Get my location</Button>

          <Button onClick={handleChangeBadgeNumber}>Set app badge 9</Button>

          <Button onClick={handleVibrate}>Vibrate SOS</Button>
        </ButtonGroup>

        {coords && (
          <>
            <p>
              My location: {coords.latitude}, {coords.longitude}
            </p>

            <ButtonGroup>
              <Button variant="primary" onClick={handleCopy}>
                Copy coordinates
              </Button>

              <Button variant="primary" onClick={handleShare}>
                Share my coords
              </Button>

              <Button
                className="App-link"
                href={locationSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Google Maps
              </Button>
            </ButtonGroup>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
