import React, { useState, useEffect, useRef } from 'react'; 
import L from 'leaflet'; 
import orderResults from './helper/orderResults'
import './InfoWindow.scss'

const InfoWindow = (props) => {
    // console.log("Infowindow gezündet")
    // console.log(props.countyData); 
   
    // hier vergeben wir Variablen zu den Werten, die wir
    // benötigen... so können wir bei unterschiedlichen Namen
    // schneller reagieren.
    const wahlberechtigte = props.countyData.Wahlberechtigte; 
    const wähler = props.countyData.Wähler; 
    const gültigeStimmen = props.countyData.gültige;
    const ortsname = props.countyData.Ort 
    console.log(props)
    
  

    
    
    
    //FUNCTIONS FÜR CONDITIONAL HTML
    let infoText = null; 
    if (props.countyData.GEN == null){
        infoText = <h2>"Bitte Gebiet anwählen"</h2>
    } else {
        infoText = "Och nö... "
    }
    

    const orderedCountyResults = orderResults(props.countyData)
    console.log(orderedCountyResults)
    return(
        <div className="infoWindow">
        <h3>Hallo, hier ist InfoWindow mit den Daten aus {props.countyData.GEN}</h3>
        {orderedCountyResults.map((result) => {
            return (
                <h6>das ergebnis {result[0]},{(result[1]/gültigeStimmen*100).toFixed(1)} Prozent</h6>
            )
        })
        }
        
        </div>
    )
}

export default InfoWindow; 