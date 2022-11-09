
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import cloud_png from '../icons/cloud.png'
import sunny_png from '../icons/sunny.png'
import rain_png from '../icons/rainy-day.png'
import snow_png from '../icons/snowfall.png'

const weather_converter = {
    0: "Чистое небо",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45:"Fog",
    48:"Depositing rime fog", 
    51:"Drizzle: Light",
    53:"Drizzle: moderate",
    55:"Drizzle: dense intensity",
    56: "Freezing Drizzle Light",
    57: "Freezing Drizzle dense intensity",
    61: "Rain: Slight",
    63: "Rain: moderate",
    65: "Rain: heavy intensity",
    66: "Freezing Rain Light",
    67: "Freezing Rain heavy intensity",
    71: "Snow fall: Slight",
    73: "Snow fall: moderate",
    75:	"Snow fall: heavy intensity",
    77:	"Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: moderate",
    82:	"Rain showers: violent",
    85: "Snow showers slight",
    86:	"Snow showers heavy",
}

const GetWeatherIcon = ({weathercode}) => {
    switch (weathercode) {
        case 0:
        case 1:
            return  <img width={100} src={sunny_png} />
        case 2:
        case 3:
        case 45:
        case 48:
        case 51:
        case 53:
        case 55:
            return <img width={100} src={cloud_png} />
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            return <img width={100} src={rain_png} />
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return <img width={100} src={snow_png} />
        default:
             return <img width={100} src={sunny_png} />
    }
}

export const TemperatureWidget = ({value}) => {
    const data = [];
    let weather = {};
    if(value){
        for (let index = 0; index < 24 + 1 ; index++) {
            const temperature = value["hourly"]["temperature_2m"][index];
            const date = new Date(value["hourly"]["time"][index]);
            data.push({
                name:  ` ${date.getHours()}:00`,
                uv: temperature,
                pv: 24,
                amt: 24
            })
        }
        weather.IsConverted = weather_converter.hasOwnProperty(value["current_weather"]["weathercode"]);
        weather.code = value["current_weather"]["weathercode"];
    }

    return value ? (
        <div className='temperature-widget'>
            <LineChart width={1000} height={250} data={data}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
            </LineChart>
            <div className='current-info-table'>
                <div className='current-info-table-text-block'>
                    {`Текущая температура: ${value["current_weather"]["temperature"]} °C`} <br/>
                    Скорость ветра: {value["current_weather"]["windspeed"]} м.с <br/>
                    {weather.IsConverted ? <>{weather_converter[weather.code]}</> : null}
                </div>
                <GetWeatherIcon weathercode={weather.code} />
            </div>
        </div>
    ) : <></>
}