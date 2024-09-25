import { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Image from "react-bootstrap/Image";

import logo from "../logo.svg";

import "../App.css";

const VIBRATION_PATTERN = [
  100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100,
];

const GOOGLE_QUERY_URL = "https://www.google.com/search?q=";

const LOFI_CHANNEL_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk";

export const Home = () => {
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

  const shareData = (sharedData: ShareData) => {
    if (navigator.canShare(sharedData)) {
      navigator.share(sharedData);
    } else {
      alert("Cannot share data");
    }
  };

  const handleShareLocation = () =>
    shareData({
      title: "Share location",
      text: "Your location will be shared",
      url: locationSearchUrl,
    });

  const handleYoutubeUrl = () =>
    shareData({
      title: "Share location",
      text: "Your location will be shared",
      url: LOFI_CHANNEL_URL,
    });

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
    <div>
      <Image src={logo} className="App-logo" alt="logo" />

      <ButtonGroup>
        <Button onClick={fetchCurrentPosition}>Get my location</Button>

        <Button onClick={handleChangeBadgeNumber}>Set app badge 9</Button>

        <Button onClick={handleVibrate}>Vibrate SOS</Button>

        <Button onClick={handleYoutubeUrl}>Share youtube channel</Button>
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

            <Button variant="primary" onClick={handleShareLocation}>
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
    </div>
  );
};
