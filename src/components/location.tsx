"use client";

import { calculateDistance, Location } from "@/utils/haversine_distance";
import { frankfurt, iowa } from "@/utils/locations";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ClientLocation = () => {
  const [location, setLocation] = useState<Location | null>();
  const [region, setRegion] = useState<string | null>();

  const { data, error, isLoading } = useSWR(
    region ? `/api/hello?region=${region}` : null,
    fetcher
  );
  const { data: counter, error: errorCounter, isLoading: isLoadingCounter } = useSWR(
    region ? `/api/counter?region=${region}` : null,
    fetcher
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ lat: latitude, long: longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (location) {
      const distToUS = calculateDistance(location, iowa);
      const distToEU = calculateDistance(location, frankfurt);

      if (distToUS < distToEU) {
        setRegion("US");
      } else {
        setRegion("EU");
      }
    }
  }, [location]);

  return (
    <div>
      <p>Lat: {location?.lat}</p>
      <p>Long: {location?.long}</p>
      <p className="mt-4">
        Distance to Frankfurt, Germany:{" "}
        <span className="font-extrabold">
          {location &&
            calculateDistance(location, frankfurt).toFixed(2) + " km"}
        </span>
      </p>
      <p>
        Distance to Iowa, United-States:{" "}
        <span className="font-extrabold">
          {location && calculateDistance(location, iowa).toFixed(2) + " km"}
        </span>
      </p>
      <p className="mt-4">
        Closest Region:{" "}
        <span className="font-extrabold">{region?.toUpperCase()}</span>
      </p>
      <p>
        Selected Cloud Provider:{" "}
        <span className="font-extrabold">
          {region?.toLowerCase() === "eu"
            ? "Amazon Web Services"
            : "Google Cloud Platform"}
        </span>
      </p>
      <p className="font-bold mt-1">
        {region?.toLowerCase() === "eu" ? "AWS" : "GCP"}{" "}
        {" is the closest cloud provider to your location"}
      </p>
      <p className="font-bold mt-4 text-lg">
        {"Live Redis data from"} {region?.toLowerCase() === "eu" ? "AWS" : "GCP"}{" "}
        {" is"} {data && JSON.stringify(data)}
      </p>
      <p className="font-bold mt-4 text-lg">
        {"Live Redis counter from"} {region?.toLowerCase() === "eu" ? "AWS" : "GCP"}{" "}
        {" is"} {counter && JSON.stringify(counter)}
      </p>
      <p className="font-bold mt-4 text-lg">
        {"This page has been visited from"} {region?.toLowerCase() === "eu" ? "AWS" : "GCP"}{" "}
        {" for"} {counter && counter.counter}{" times."}
      </p>
    </div>
  );
};
