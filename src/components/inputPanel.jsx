import axios from "axios";
import { useState } from "react"
import { TemperatureWidget } from "./temperatureWidget";
import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Saves } from "./Saves";

const API_KEY = "AIzaSyDyxsj5WH5E9vSlt5MReuZ4kM8gOwVGzc0"

const containerStyle = {
    width: '1000px',
    height: '600px',
    margin: "auto"
};

const validateInput = (value, callaback, updateMap) => {
    let valid = (!/^\s*$/.test(value) && !isNaN(value)) || value === "-";
    if(!valid && value !== "")
        return;
    callaback(value);
    updateMap();
}
  
export const WeatherApp = (props) => {
    const [widgets, setWidgets] = useState([]);
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [temp, setTemp] = useState();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    })
    const [map, setMap] = React.useState(null)
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds({
            lat: -3.745,
            lng: -38.523
        });
        map.fitBounds(bounds);
        setMap(map)
    }, [])
    function handleCenterChanged() {
        if (!map) 
            return;
        const newPos = map.getCenter().toJSON();
        setLongitude( parseFloat(newPos.lng) );
        setLatitude(parseFloat(newPos.lat));
    }
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])
    const updateMap = (latitude, longitude) => {
        if(!map) return;
        map.setCenter(new window.google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)), 10);
    }
    const formSubmit = (event) => {
        axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${"temperature_2m"}&current_weather=${"true"}&windspeed_unit=${"ms"}`)
        .then((res) => {
            let currentTemp = res.data;
            setTemp(currentTemp);
        })
        .catch((reason) => {
            console.error(reason.response);
        })
        event.preventDefault();
    }
    const AddWidget = () =>{
        if(!temp) 
            return;
        widgets.push(temp);
        setWidgets([...widgets]);
    }
    const deleteWidget = (data) => {
        const index = widgets.indexOf(data);
        if (index > -1) { 
            widgets.splice(index, 1); 
            setWidgets([...widgets]);
        }
    }
    
    return(
        <div>
            <Saves data={widgets} setTemp={setTemp} setLatitude={setLatitude} setLongitude={setLongitude} updateMap={updateMap} deleteWidget={deleteWidget}/>
            <form onSubmit={formSubmit} className="temperature-form">
                <label>
                    Широта:
                    <input type="text" value={latitude} onChange={(event) => {
                        validateInput(event.target.value, setLatitude, () => {updateMap(event.target.value, longitude)} );
                    }} />
                </label>
                <br></br>
                <label>
                    Долгота: 
                    <input type="text" value={longitude} onChange={(event) => {
                        validateInput(event.target.value, setLongitude, () => {updateMap(latitude, event.target.value)} );
                    }} />
                </label>
                <input type="submit" value="Узнать погоду" className="green"/>
                <input type="button" value="В закладки" className="green" onClick={AddWidget} />
            </form>
            <TemperatureWidget value={temp} />
            {isLoaded ? (<GoogleMap mapContainerStyle={containerStyle} zoom={0} onLoad={onLoad} onUnmount={onUnmount} onCenterChanged={handleCenterChanged}> </GoogleMap>
            ) : <></>}
        </div>
    )
}