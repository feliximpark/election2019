import React, { useState, useEffect, useRef } from 'react'; 
import L from 'leaflet'; 
import InfoWindow from './InfoWindow'; 
import 'leaflet-boundary-canvas/src/BoundaryCanvas';
import orderResults from './helper/orderResults'; 
import './LMap.scss';
//import sachsenLandkreise from '../data/sachsen_kreise.geojson'
//import sachsenLandkreiseJs from '../data/sachsen_kreise'
//Landesgrenzen Sachsen Linien
import sachsen_land from '../data/sachsen_land'
//Kommune Sachsen mit Ergebnissen
import sachsenKommunenEndergebnisse from '../data/EU_Ergebnis_Land_final'


const LMap = (props) => {

    // STATES der MAP
    //Zentrum der Karte (muss in der Regel nicht verändert werden. )
    const[mapPosition, setMapPosition] = useState({
        lat:51.047811, 
        lng: 13.565813
    });
    const position = [mapPosition.lat, mapPosition.lng]; 
    //Start-Zoom-Faktor der Karte
    let[mapZoom, setMapZoom] = useState({
        zoom: 9
    }); 
   
    //CONTROLLER-STATES
    const[mapLoaded, setMapLoaded] = useState({
        loaded: false 
    });
    



    //INFORMATION-STATES
    //State der den kompletten Datensatz eines Landkreises trägt
    const[mapCountyData, setMapCountyData] = useState({});

    //REFERENZEN mit MAPREF 
    //auf Karte
    let mapRef = useRef(null); 

    //MAP-CREATER-FUNCTIONEN
    // KARTE INITIAL beim ersten Rendern anlegen
    // inklusive aller Layer und ihrer Optionen
    // wird nur beim ersten Rendern aufgerufen
    useEffect(() => {
        
        //-------------xxxxxxxxxxxxxxxxxxx-----------------
        // KARTEN-EINSTELLUNGEN
        // URL zu Tiles, Quellennachweisen und Labels
        const mapTilesUrl =  'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
        const mapTilesAttributes =  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
        //const mapTilesLabel = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png'
        const mapTilesLabel = 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png'
        //Map inklusive einzelne Layer mit Parametern
        
        const map = L.map('Lmap-map', {
            center: position, 
            zoom: mapZoom.zoom
        });
        //Pane für die Labels vorbereiten 
        map.createPane('labels');
        map.getPane('labels').style.zIndex = 650;
        //sorgt dafür, dass Clickenvents einfach durchlaufen
        map.getPane('labels').style.pointerEvents = 'none';
        //Optionen der Kartenlayer und der Labellayer
        //Plugin BoundaryCanvas sorgt dafür, dass wir nur einen abgegrenzten Bereich sehen
        const mapTileLayer = new L.TileLayer.BoundaryCanvas(
            mapTilesUrl, {
                boundary: sachsen_land,
                attribution: mapTilesAttributes, 
                minZoom: 0, 
                maxZoom: 20 
            }
        );
        //Labellayer wird erstellt und an Map angehangen
        const mapLabelLayer = new L.TileLayer.BoundaryCanvas(
            mapTilesLabel, {
                boundary: sachsen_land,
                attribution: mapTilesAttributes,
                subdomains: 'abcd',  
                pane: 'labels'}
        ).addTo(map);
        //state der Map wird verändert     
        setMapLoaded({loaded: true});         
        mapRef.current = map; 
    }, []); 



    //LANDKREIS-Choroplethen werden eingebaut
    //erstmal nur beim ersten Rendern einsetzen
    //TODO: Muss noch auf Rendern bei bestimmten props geändert werden. 
    // Idee: Wir vergeben einen state mit Titel "Start". Der wird beim 
    // ersten Start vergeben und speist sich aus einer Mini-Datei nur mit 
    // den Geodaten und einem Sieger. 
    // TODO: Vielleicht muss ich am Anfang auf D3 und Topojson setzen, um die
    // Dateigröße kleinzukriegen
    useEffect(() => {
        
        const map = mapRef.current;
        //Style und Daten der Kreise- und Kommunenlayer

        
        //color-Function... muss sich später dem Analysegegenstand anpassen
        const getCountyColor = (d) => {
            //orderResults ist helper-Function
            let first = orderResults(d)[0][0]; 
            let colormap; 
            if (first == "CDU"){
                if (d["CDU in %"]>="30,0"){
                    colormap= "#000";
                }
                else{
                    colormap= "#595959";
                }
            }
            if (first == "AfD"){
                if (d["AfD in %"]>="30,0"){
                    colormap= "#0539af";
                }
                else{
                    colormap = "#8faff7"; 
                }
            }
            if (first == "GRÜNE"){
                if (d["GRÜNE in %"]>="30,0"){
                    colormap = "#5bc613";
                }
                else{
                    colormap = "#aeea85";
                    
                }
            }
            if (d.Ortname=="Mittelherwigsdorf"){
                colormap = "#f7f7f7"; 
            }
            return colormap; 
        }
        //Style der einzelnen Kommunen wie Farbe, Borders etc. 
        const mapKommunenLayerStyle = (feature) => {
            return {
                fillColor: getCountyColor(feature.properties), 
                weight: 2,
                opacity: 0.5,
                color: 'white',
                dashArray: '0',
                fillOpacity: 0.7,
                className: "countyArea" 
                 
            }; 
        } 
        // Eventhandler der einzelnen Kommunen
        const mapKommunenFeatures = (feature, layer) => {
            layer.on({
                click: mouseClickEvent, 
                mouseover: mouseOverEvent
            })
        }

        // Eventhandler mouseclick und mouseover
        function mouseClickEvent(e){
            const center = e.target.getBounds().getCenter(); 
            map.setView([center.lat, center.lng], 12); 
            setMapZoom({zoom:12}); 
            console.log("klick"); 
            console.log(mapZoom.zoom); 
             
        }
        function mouseOverEvent(e){
            const target = e.target.feature.properties; 
            setMapCountyData(target); 
        }

        // Erstellung der einzelnen Landkreise und Kommunen
        // Laden der geoJSON-Daten
        const mapKommunenLayer = L.geoJSON(sachsenKommunenEndergebnisse, {
            style: mapKommunenLayerStyle, 
            onEachFeature: mapKommunenFeatures
        })
        
        // Layer an map anheften
        mapKommunenLayer.addTo(map); 

        //mapRef aktualisieren
        mapRef.current = map; 
    },[])

    
    

        
    return (
        <React.Fragment>
        <h1>Titel {mapZoom.zoom}</h1>
        <div id="Lmap-map">
            <div className="waitingForMap"
            style={{display:(mapLoaded.loaded? "none" : null)}}>
                <h1>Bitte warten...</h1>
            </div>
        </div>
        <h1>Testschrift. Wird neu gerendert? </h1>
        <InfoWindow className="InfoWindow" countyData={mapCountyData}></InfoWindow>
        <button onClick={() => setMapCountyData("uuuund geändert")}>Klick mich</button>
        </React.Fragment>
    )
   
   

}

export default LMap; 