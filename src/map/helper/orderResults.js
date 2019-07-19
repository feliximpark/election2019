const orderResults = (countyProperties) => {
    
    // Variable, die auf den richtigen Pfad weist (sollte der sich ändern)
    // oder sollte Datenquelle anders strukturiert sein
    // ist im zweiten Nachdenken aber Quatsch...
    // wir müssen stattdessen dafür sorgen, dass immer die gleiche Struktur
    // übergeben wird... ansonsten müssten wir ja für jedes Modul eine individuelle 
    // Source festlegen. 
     
    const source = countyProperties; 
    
    //Jetzt lege ich für jede Partei eine Variable an

    const cdu = source.CDU; 
    const spd = source.SPD; 
    const grüne = source.GRÜNE; 
    const linke = source["DIE LINKE"];
    const fdp = source.FDP;  
    const afd = source.AfD; 
    const npd = source.NPD; 
    const freie_wähler = source["FREIE WÄHLER"]; 
    const piraten = source["PIRATEN"]; 
    const tierschutzpartei = source.Tierschutzpartei; 
    const diepartei = source["Die PARTEI"]; 
    const ödp = source.ÖDP; 
    const kpd = source.KPD; 
    const humanisten = source["Die Humanisten"]; 
    const gesundheit = source.Gesundheitsforschung; 
    const büso = source.BüSo; 
    const aufbruch = source.ADPM; 
    const blaue = source["Blaue #TeamPetry"]; 
    const vernunft = source.PDV; 

    console.log(cdu); 


    const sortedCountyResults = [["CDU", cdu], ["SPD", spd], ["GRÜNE", grüne], ["DIE LINKE", linke], ["AfD", afd], ["FDP", fdp], 
                ["NPD", npd], ["FREIE WÄHLER", freie_wähler], ["PIRATEN", piraten], ["Tierschutzpartei", tierschutzpartei], 
                ["Die PARTEI", diepartei], ["ÖDP", ödp], ["PDV", vernunft], ["Blaue #TeamPetry", blaue], 
                ["KPD", kpd], ["Die Humanisten", humanisten], ["Gesundheitsforschung", gesundheit], 
                ["ADPM", aufbruch], ["BüSo", büso]
                ]
    sortedCountyResults.sort(function(b,a){
        return a[1] - b[1]
    }); 
    return sortedCountyResults; 
    }
    





export default orderResults; 