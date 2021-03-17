import './App.css';
import React, { useState } from "react";
import axios from "axios";
import _ from "lodash";

function App() {
  const [gotResponse, setGotResponse] = useState(false);
  const [city, setCity] = useState('');
  const [response, setResponse] = useState('');
  const [cityDisplay, setCityDisplay]= useState('');

  const submit = () => {
    axios.get("/api/fetchWeather/"+city)
    .then((res)=>{
      console.log(res['data']['daily'][0]['temp']['day'].toString())
      setGotResponse(true)
      setResponse(res)
      setCityDisplay(city)
      
    });
  }
  const showWeek = () => {
    return response?.data?.daily?.map(day => {
      return(
      <div style={{margin:4, borderRadius:25, borderStyle:"groove", padding:10, borderColor:'grey'}}>
      <h3>{(new Date(day.dt*1000).toLocaleString("en",{weekday:"long"}))}</h3>
      <p style={{fontSize:24}}>{day.temp?.day.toString()}°C</p> 
      <p>{day.temp?.min.toString()}/{day.temp?.max.toString()}°C</p>
      <p>{titleCase(day.weather[0]?.description)}</p>
      <p> Humidity: {day.humidity.toString()}% </p>
      <p> Wind Speed: {day.wind_speed.toString()} km/h</p>
      </div>
      )
    });
  }

  const titleCase = (str) => {
    return(_.startCase(_.lowerCase(str)));
  }
  
  return (
    <div className="App">
      <div>
        <h1>Weather Forecast</h1>
        <label>Enter City: </label>
        <input style={{backgroundColor:"#343a44", color:"white", borderStyle:"groove"}} type="text" name="city" onChange={(e) => setCity(e.target.value)}/> 
        <button  style={{backgroundColor:"#343a44", color:"white", borderStyle:"groove"}} onClick={submit}>
          Submit
        </button>
      </div>
      <div style={{display: gotResponse ? 'block' : 'none'}}>
        <h2 style={{marginBottom:5}}>Current Weather</h2> 
        <div style={{margin:"auto", borderRadius:25, borderStyle:"groove", padding:10, maxWidth:"15%", justifyContent:"center", borderColor:'grey'}}>
          <h3 style={{marginBottom:0}}>{titleCase(cityDisplay)} </h3>
          <h3 style={{justifyContent:"center"}}>{(new Date(response?.data?.current?.dt*1000).toLocaleString())}</h3>
          <p style={{fontSize:24}}>{response?.data?.current?.temp.toString()}°C</p> 
          <p>Feels like: {response?.data?.current?.feels_like.toString()}</p>
          <p>{titleCase(response?.data?.current?.weather[0]?.description)}</p>
          <p>Humidity: {response?.data?.current?.humidity}%</p>
          <p>Wind Speed: {response?.data?.current?.wind_speed} km/h</p>
        </div>
        <h2 style={{marginBottom:5}}>7-Day Weather Forecast</h2> 
        <div style={{display:"flex", flexWrap:"wrap", justifyContent: "center"}}>
          {showWeek()}
        </div>
        
      </div>
    </div>
  );
}

export default App;
