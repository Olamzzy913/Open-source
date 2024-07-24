/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Head from "next/head";
import { useEffect, useState } from "react";

const Map = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getLocation();
    console.log(latitude, longitude);
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating…");
      navigator.geolocation.getCurrentPosition(success);
    }
  };

  const success = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);

    setStatus("");
  };

  return (
    <>
      <Head></Head>
      <div>
        Latitude of current location {latitude} Longitude of current location{" "}
        {longitude}
      </div>
    </>
  );
};

export default Map;
