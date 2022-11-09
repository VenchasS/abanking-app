
export const Saves = ({data, setTemp, setLatitude, setLongitude, updateMap}) =>{
    const elems = data.map((e) => {
        return(
            <div className="widget green" onClick={() => {
                setLatitude(e.latitude);
                setLongitude(e.longitude);
                setTemp(e)
                updateMap(e.latitude, e.longitude);
                }}>
                {`широта: ${e.latitude}`} <br/>
                {`долгота: ${e.longitude}`} <br/>
                {`температура: ${e["current_weather"]["temperature"]} °C`}
            </div>
        )
    })
    return(
        <div className="widgets-container">
            {elems}
        </div>
    )
}