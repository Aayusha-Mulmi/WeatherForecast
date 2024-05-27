import React from "react";

export default function LastContent({ TomMinTemp, TomMaxTemp,ThursMinTemp, ThursMaxTemp,
  FriMinTemp,FriMaxTemp ,SatMinTemp, SatMaxTemp ,TLIcon,ThIcon,FIcon,SIcon}) {
  return (
    <div className="Finalcontent">
      <div className="last-left">
        <div className="Tom--licon">  <span
          className="material-symbols-outlined"
          style={{ color: "#aeada8", fontSize: "0.4em" }}
        >
          rainy
        </span></div>
        <div className="last-temp">
          {TomMinTemp} °/ {TomMaxTemp}°
        </div>
        <span className="span1">TOM</span>
      </div>

      <div className="last-sleft">
      <div className="Thur--licon"> <span
          className="material-symbols-outlined"
          style={{ color: "#aeada8", fontSize: "0.4em" }}
        >
          partly_cloudy_night
        </span></div>
        <div className="last-temp">
          {ThursMinTemp} °/ {ThursMaxTemp}°
        </div>
        <span className="span1">THUR</span>
      </div>

      <div className="last-sright">
      <div className="Fri--licon"><i
          className="bx bx-sun"
          style={{ color: "#f5cb42", fontSize: "0.4em" }}
        ></i></div>
        <div className="last-temp">
          {FriMinTemp} °/ {FriMaxTemp}°
        </div>
        <span className="span1">FRI</span>
      </div>

      <div className="last-right">
      <div className="Sat--licon"><i
          className="bx bx-sun"
          style={{ color: "#f5cb42", fontSize: "0.4em" }}
        ></i></div>
        <div className="last-temp">
          {SatMinTemp} °/ {SatMaxTemp}°
        </div>
        <span className="span1">SAT</span>
      </div>
<<<<<<< HEAD

      
=======
>>>>>>> 7e7ee91540c0341e07553177305ee971dfc4e7b9
    </div>
  );
}
