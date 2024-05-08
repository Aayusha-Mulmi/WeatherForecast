import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Typewriters from "./components/Typewriters";
import CenterContent from "./components/CenterContents";
import LastContent from "./components/LastContent";

const api = {
  key: "b707cfbff99545e785fc7ce3740f04ab",
  base: "https://api.geoapify.com/v1/geocode/",
};

const temperatureApi = {
  base: "https://api.open-meteo.com/v1/",
};

function App() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState({});
  const [temperature, setTemperature] = useState(null);
  const [mintemp, setMinTemp] = useState([]);
  const [maxtemp, setMaxTemp] = useState([]);
  const [tommin, setTommin] = useState([]);
  const [tommax, setTommax] = useState([]);
  const [thurmin, setThurmin] = useState([]);
  const [thurmax, setThurmax] = useState([]);
  const [frimin, setFrimin] = useState([]);
  const [frimax, setFrimax] = useState([]);
  const [satmin, setSatmin] = useState([]);
  const [satmax, setSatmax] = useState([]);
  const [rain, setRain] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      SearchPressed();
    }
  };

  const SearchPressed = () => {
    fetch(`${api.base}search?text=${search}&format=json&apiKey=${api.key}`)
      .then((response) => response.json())
      .then((result) => {
        console.log("API Result:", result);
        if (result.results && result.results.length > 0) {
          setLocation(result);

          console.log("dd", result.results[0].lat);
          setShowContent(true);
          setNoResults(false); // Clear any previous errors
        } else {
          setNoResults(true);
          setShowContent(false);
        }
      })
      .catch((error) => {
        console.error("Search API Error:", error);

        setShowContent(false);
      });
  };
  useEffect(() => {

    const weather_key='weather_'+search.toLowerCase().replace(/\s/g, '_');
    const storedWeatherData = JSON.parse(
      localStorage.getItem(weather_key) || "[]"
    );


    //function return 
    // if (storedWeatherData) {
    //   console.log("appl");
    //   return;
    // }

    

    // if empty return false;

    if (location.results && location.results.length > 0) {
      fetch(
        `${temperatureApi.base}forecast?&latitude=${location.results[0].lat}&longitude=${location.results[0].lon}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min`
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("Temperature API Result:", result);
          setTemperature(result);
          setMinTemp(result.daily && result.daily.temperature_2m_min);
          setMaxTemp(result.daily && result.daily.temperature_2m_max);
          setTommin(result.daily && result.daily.temperature_2m_min);
          setTommax(result.daily && result.daily.temperature_2m_max);
          setThurmin(result.daily && result.daily.temperature_2m_min);
          setThurmax(result.daily && result.daily.temperature_2m_max);
          setFrimin(result.daily && result.daily.temperature_2m_min);
          setFrimax(result.daily && result.daily.temperature_2m_max);
          setSatmin(result.daily && result.daily.temperature_2m_min);
          setSatmax(result.daily && result.daily.temperature_2m_max);
          setRain(result.current && result.current.rain);
          setHumidity(result.current && result.current.relative_humidity_2m);
          setWind(result.current && result.current.wind_speed_10m);

          const currentLocationData = {
            customKey: "weather",
            location: location,
            temperature: result,
            minTemp: result.daily && result.daily.temperature_2m_min,
            maxTemp: result.daily && result.daily.temperature_2m_max,
            Tommin: result.daily && result.daily.temperature_2m_min,
            Tommax: result.daily && result.daily.temperature_2m_max,
            Thurmin: result.daily && result.daily.temperature_2m_min,
            Thurmax: result.daily && result.daily.temperature_2m_max,
            Frimin: result.daily && result.daily.temperature_2m_min,
            Frimax: result.daily && result.daily.temperature_2m_max,
            Satmin: result.daily && result.daily.temperature_2m_min,
            Satmax: result.daily && result.daily.temperature_2m_max,
            Rain: result.current && result.current.rain,
            Humidity: result.current && result.current.relative_humidity_2m,
            Wind: result.current && result.current.wind_speed_10m,
          };

          // const existingDataIndex = storedWeatherData.findIndex(
          //   (data) =>
          //     data.location.results[0].lat === location.results[0].lat &&
          //     data.location.results[0].lon === location.results[0].lon
          // );

          // if (existingDataIndex !== -1) {
          //   storedWeatherData[existingDataIndex] = currentLocationData;
          // } else {
          //   storedWeatherData.push(currentLocationData);
          // }

          localStorage.setItem(weather_key, JSON.stringify(currentLocationData));
        })
        .catch((error) => console.error("Temperature API Error:", error));
    }
  }, [location]);

  useEffect(() => {
    const clearLocalStorage = () => {
      localStorage.clear();
    };

    const clearTimer = setTimeout(clearLocalStorage, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearTimeout(clearTimer);
  }, []);

  return (
    <div>
      <Navbar />
      <Typewriters
        city={
          location &&
          location.results &&
          location.results[0] &&
          location.results[0].country
        }
      />

      <div className="container">
        <h1>
          <span className="static-text">
            Right now{" "}
            <input
              type="text"
              id="city"
              style={{
                border: "none",
                outline: "none",
                borderBottom: "0.5px solid black",
                fontSize: "28px",
                backgroundColor: "#fafafa",
                fontWeight: "bold",
                fontFamily: '"Inria Sans", sans-serif',
              }}
              placeholder="Enter city/town"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </span>
        </h1>
      </div>

      {noResults && <p>No results found.</p>}
      {showContent && (
        <>
          <CenterContent
            temperature={
              temperature &&
              temperature.current &&
              temperature.current.temperature_2m
            }
            mintemp={mintemp[0]}
            maxtemp={maxtemp[0]}
            wind={wind}
            rain={rain}
            humidity={humidity}
          />
          <LastContent
            TomMinTemp={tommin[1]}
            TomMaxTemp={tommax[1]}
            ThursMinTemp={thurmin[2]}
            ThursMaxTemp={thurmax[2]}
            FriMinTemp={frimin[3]}
            FriMaxTemp={frimax[3]}
            SatMinTemp={satmin[4]}
            SatMaxTemp={satmax[4]}
          />
        </>
      )}
    </div>
  );
}

export default App;