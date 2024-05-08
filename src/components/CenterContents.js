import React from "react";

export default function CenterContent({
  temperature,
  mintemp,
  maxtemp,

  wind,
  rain,
  humidity,
}) {
  return (
    <div>
      <div className="center">
        <div className="left">
          <div className="sun"><i className="bx bx-sun" style={{ color: "#f5cb42" }}></i></div>
          <div className="middle">
            <div className="middle-tmp">{temperature}</div>
            <div className="middle-down">
              {mintemp} °/ {maxtemp}°
            </div>
          </div>
        </div>

        <div className="items">
          <div className="item1">
            <i className="bx bx-wind"></i>
            <span className="fgif">
              {wind}
              <span className="mph">mph</span>
            </span>
          </div>

          <div className="item2">
            <img className="umbrella" src="../images/Umbrella.png" alt="" />
            <span className="sgif">
              {rain}
              <span className="mph">%</span>
            </span>
          </div>

          <div className="item3">
            <i className="bx bx-droplet"></i>
            <span className="sgif">
              {humidity}
              <span className="mph">%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
