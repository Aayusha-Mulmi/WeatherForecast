import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Typewriters from "./components/Typewriters";
import CenterContent from "./components/CenterContents";
import LastContent from "./components/LastContent";
import FadeLoader from "react-spinners/FadeLoader";

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
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [unit, setUnit]=useState("C")
  const [celsiusHighlighted, setCelsiusHighlighted] = useState(true);
const [fahrenheitHighlighted, setFahrenheitHighlighted] = useState(false);

  // const onChange = async (e) => {
  //   setSearch(e.target.value);
  //   const response = await fetch(
  //     `${api.base}autocomplete?text=${e.target.value}&limit=5&apiKey=${api.key}`
  //   );
  //   const data = await response.json();
  //   console.log(data);
  //   setSuggestions(data.features);
  // };



  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      SearchPressed();
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    console.log("loading");
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const successCallback = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetch(
      `${api.base}reverse?lat=${latitude}&lon=${longitude}&apiKey=${api.key}`
    )
      .then((response) => response.json())
      .then((result) => {
        const confirmMessage = `Your current location: ${result.features[0].properties.formatted}`;
        if (window.confirm(confirmMessage)) {
          console.log("User clicked OK");
          console.log("Location API Result:", result);
          setLocation(result);
          setSearch(result.features[0].properties.formatted);
          setShowContent(true);
          setNoResults(false);
          fetchWeatherData(latitude, longitude);
        } else {
          console.log("User clicked Cancel");
        }
        console.log("Location API Result:", result);
        setLocation(result);
        setShowContent(true);
        setNoResults(false);
        fetchWeatherData(latitude, longitude);
      })

      .catch((error) => {
        console.error("Location API Error:", error);
      });
  };

  const errorCallback = (error) => {
    console.error("Geolocation error:", error);
  };

  const fetchWeatherData = (latitude, longitude) => {
    fetch(
      `${temperatureApi.base}forecast?&latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min`
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
      })
      .catch((error) => console.error("Temperature API Error:", error));
  };

const celsiusToFahrenheit = (celsius) => ((celsius * 9) / 5 + 32).toFixed(2);
const fahrenheitToCelsius = (fahrenheit) => (((fahrenheit - 32) * 5) / 9).toFixed(2);

const convertTemperature = (temperature, targetUnit) => {
  if (Array.isArray(temperature)) {
    if (targetUnit === "F") {
      return temperature.map((temp) => celsiusToFahrenheit(temp));
    } else {
      return temperature.map((temp) => fahrenheitToCelsius(temp));
    }
  } else {
    if (targetUnit === "F") {
      return celsiusToFahrenheit(temperature);
    } else {
      return fahrenheitToCelsius(temperature);
    }
  }
};

const handleCelsiusClick = () => {
  if (unit !== "C") {
    setMinTemp(convertTemperature(mintemp, "C"));
    setMaxTemp(convertTemperature(maxtemp, "C"));
    setTommin(convertTemperature(tommin, "C"));
    setTommax(convertTemperature(tommax, "C"));
    setThurmin(convertTemperature(thurmin, "C"));
    setThurmax(convertTemperature(thurmax, "C"));
    setFrimin(convertTemperature(frimin, "C"));
    setFrimax(convertTemperature(frimax, "C"));
    setSatmin(convertTemperature(satmin, "C"));
    setSatmax(convertTemperature(satmax, "C"));
    setTemperature({
      ...temperature,
      current: {
        ...temperature.current,
        temperature_2m: convertTemperature(temperature.current?.temperature_2m, "C")
      }
    });
    setUnit("C");
    setCelsiusHighlighted(true);
    setFahrenheitHighlighted(false);
  }
};

const handleFahrenheitClick = () => {
  if (unit !== "F") {
    setMinTemp(convertTemperature(mintemp, "F"));
    setMaxTemp(convertTemperature(maxtemp, "F"));
    setTommin(convertTemperature(tommin, "F"));
    setTommax(convertTemperature(tommax, "F"));
    setThurmin(convertTemperature(thurmin, "F"));
    setThurmax(convertTemperature(thurmax, "F"));
    setFrimin(convertTemperature(frimin, "F"));
    setFrimax(convertTemperature(frimax, "F"));
    setSatmin(convertTemperature(satmin, "F"));
    setSatmax(convertTemperature(satmax, "F"));
    setTemperature({
      ...temperature,
      current: {
        ...temperature.current,
        temperature_2m: convertTemperature(temperature.current?.temperature_2m, "F")
      }
    });
    setUnit("F");
    setFahrenheitHighlighted(true);
    setCelsiusHighlighted(false);
  }
};

  

  // Location data is not changed frequently so we dont use useEffect here
  var weather_key = "weather_" + search.toLowerCase().replace(/\s/g, "_");
  const SearchPressed = () => {
    const storedLocation = localStorage.getItem(weather_key); // retrieve data from local storage

    if (storedLocation) {
      // if data is found
      setLocation(JSON.parse(storedLocation)); //sets the location
      setShowContent(true); // shows the content
      setNoResults(false);
    } else {
      // If location data is not found, make an API request
      fetch(`${api.base}search?text=${search}&format=json&apiKey=${api.key}`)
        .then((response) => response.json())
        .then((result) => {
          console.log("API Result:", result);
          if (result.results && result.results.length > 0) {
            setLocation(result);
            setShowContent(true);
            setNoResults(false);
          } else {
            setNoResults(true);
            setShowContent(false);
          }
        })
        .catch((error) => {
          console.error("Search API Error:", error);
          setShowContent(false);
        });
    }
  };

  useEffect(() => {
    const storedLocation = localStorage.getItem(weather_key) || "[]";
    if (storedLocation !== "[]") {
      // Do fetching stuffs
      const result = JSON.parse(localStorage.getItem(weather_key) || "[]");
      console.log(result);
      setTemperature(result.temperature);
      setMinTemp(result.minTemp);
      setMaxTemp(result.maxTemp);
      setTommin(result.Tommin);
      setTommin(result.Tommax);
      setThurmax(result.Thurmax);
      setThurmin(result.Thurmin);
      setFrimin(result.Frimin);
      setFrimax(result.Frimax);
      setSatmin(result.Satmin);
      setSatmax(result.Satmax);
      setRain(result.Rain);
      setHumidity(result.Humidity);
      setWind(result.Wind);
    } else {
      // Else update from the local storage
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
            localStorage.setItem(
              weather_key,
              JSON.stringify(currentLocationData)
            );
          })
          .catch((error) => console.error("Temperature API Error:", error));
      }
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
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <FadeLoader color={"#808387"} loading={loading} size={50} />
        </div>
      ) : (
        <>
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
                  placeholder={`${search}`} //"Enter city/town"
                  onChange={((e)=>setSearch(e.target.value))}
                  onKeyDown={handleKeyPress}
                />
              </span>
            </h1>
            {/* <div className="dropdown-content">
              {suggestions &&
                suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => {
                      setSearch(suggestion.properties.formatted);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion.properties.formatted}
                    <hr />
                  </div>
                ))}
            </div> */}
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

              <div className="last_buttons">
                <button className={`celsius_button ${celsiusHighlighted ? 'highlight' : ''}`} onClick={handleCelsiusClick}>°C </button>|
                <button className= {`fahrenheit_button ${fahrenheitHighlighted ? 'highlight' : ''}`}onClick={handleFahrenheitClick}>°F</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
