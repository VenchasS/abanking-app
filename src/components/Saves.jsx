import delete_png from '../icons/delete.png'

export const Saves = ({data, setTemp, setLatitude, setLongitude, updateMap, deleteWidget}) =>{
    const elems = data.map((e) => {
        return(
            <div>
                <div className="widget green" onClick={() => {
                    setLatitude(e.latitude);
                    setLongitude(e.longitude);
                    setTemp(e)
                    updateMap(e.latitude, e.longitude);
                    }}>
                    <div>
                        {`широта: ${e.latitude}`} <br/>
                        {`долгота: ${e.longitude}`} <br/>
                        {`температура: ${e["current_weather"]["temperature"]} °C`}
                    </div>
                </div>
                <div className='red-btn' onClick={() => deleteWidget(e)}>
                    <img width={25} src={delete_png} alt="delete" />
                </div>
            </div>
            
        )
    })
    return(
        <div className="widgets-container">
            {elems}
        </div>
    )
}