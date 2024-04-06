/*
let mymap = L.map('map_canvas')
  .setView([47.16, 19.56], 7)
  .on("click",(e)=> {
    setCoordinate(e.latlng);
  })

L.tileLayer('https://utcakereso.hu/tile/osm/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,<a href="https://utcakereso.hu/">Utcakereso.hu</a>',
  maxZoom: 18
}).addTo(mymap); 

L.control.scale({ // Scale
  maxwidh: 400,
  imperial: false,
  position: 'bottomleft'
}).addTo(mymap);

let marker = L.marker([47.16, 19.56],{
  draggable: true, autoPan: true, autoPanSpeed: 20
})
.on("dragend click",(e)=> {
  setCoordinate(e.target.getLatLng());
})
.addTo(mymap);

const locationIcon =`
  <?xml version="1.0" encoding="utf-8"?>
  <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 14C13.6569 14 15 12.6569 15 11C15 9.34315 13.6569 8 12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 21C16.4183 19 20 15.4183 20 11C20 6.58172 16.4183 3 12 3C7.58172 3 4 6.58172 4 11C4 15.4183 7.58172 19 12 21Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

const pasteIcon =`
  <?xml version="1.0" encoding="utf-8"?>      
  <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.7778 5H14.6667C15.5047 5 15.9237 5 16.1841 5.2636C16.4444 5.52721 16.4444 5.95147 16.4444 6.8V10M13.7778 5V5.8C13.7778 6.22426 13.7778 6.4364 13.6476 6.5682C13.5174 6.7 13.3079 6.7 12.8889 6.7H7.55556C7.13653 6.7 6.92702 6.7 6.79684 6.5682C6.66667 6.4364 6.66667 6.22426 6.66667 5.8V5M13.7778 5C13.7778 4.57574 13.7778 4.2636 13.6476 4.1318C13.5174 4 13.3079 4 12.8889 4H7.55556C7.13653 4 6.92702 4 6.79684 4.1318C6.66667 4.2636 6.66667 4.57574 6.66667 5M6.66667 5H5.77778C4.93973 5 4.5207 5 4.26035 5.2636C4 5.52721 4 5.95147 4 6.8V17.1959C4 18.0445 4 18.4687 4.26035 18.7323C4.5207 18.9959 4.93973 18.9959 5.77778 18.9959H9.77778M14 20H18C18.9428 20 19.4142 20 19.7071 19.7071C20 19.4142 20 18.9428 20 18V14C20 13.0572 20 12.5858 19.7071 12.2929C19.4142 12 18.9428 12 18 12H14C13.0572 12 12.5858 12 12.2929 12.2929C12 12.5858 12 13.0572 12 14V18C12 18.9428 12 19.4142 12.2929 19.7071C12.5858 20 13.0572 20 14 20Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;  

L.Control.locationBtn = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd: ()=> {
    let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    container.title = "GPS pozíció keresés";
    let button = L.DomUtil.create('a', 'leaflet-control-button', container);
    L.DomEvent.disableClickPropagation(button);
    L.DomEvent.on(button, 'click', ()=> geoLocation());
    button.innerHTML = locationIcon;
    button.style=`background:white;width:30px;height:30px;display:flex;align-items:center;
                  justify-content:center;cursor:pointer;border:1px solid grey`;
    button.classList.add("location");        
    return container;
  }
});
const control = new L.Control.locationBtn();
control.addTo(mymap);

const getPosition=()=>{
  return new Promise((resolve, reject) => 
    navigator.geolocation.getCurrentPosition(resolve, reject,{
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 2000
    })
  )
}

const errorHandler=(error)=>{
  let msg = null;
  switch(error.code) {
    case error.PERMISSION_DENIED:
        msg = "User denied the request for Geolocation.";
        break;
    case error.POSITION_UNAVAILABLE:
        msg = "Location information is unavailable.";
        break;
    case error.TIMEOUT:
        msg = "The request to get user location timed out.";
        break;
    case error.UNKNOWN_ERROR:
        msg = "An unknown error occurred.";
        break;
  }
  alert(msg);
}

const geoLocation=async()=>{
  try {
    $(".location").css("background-color","red");
    const position = await getPosition();
    console.log("pos", position);
    let cor = {lat: position.coords.latitude, lng: position.coords.longitude};
    console.log("cor", cor);
    setCoordinate(cor);
    await new Promise((resolve)=>setTimeout(() => {
      resolve();
    }, 1000));
  } catch (err) {
    alert(err.message);
  } finally {
    $(".location").css("background-color","white");
  }
} 

L.Control.pasteBtn = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd: ()=> {
    let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    container.title = "Koordináta beillesztés\n vágólapról (LatLon)";
    let button = L.DomUtil.create('a', 'leaflet-control-button', container);
    L.DomEvent.disableClickPropagation(button);
    L.DomEvent.on(button, 'click', (e)=> pasteCoordFromClipboard(e));
    button.innerHTML = pasteIcon;
    button.style=`background:white;width:30px;height:30px;display:flex;align-items:center;
                  justify-content:center;cursor:pointer;border:1px solid grey`;
    return container;
  }
});
const control2 = new L.Control.pasteBtn();
control2.addTo(mymap);

const convertDMSToLatLng = (cor)=>{
    test: 
    47°24'10.75"N 19°02'56.25"E
    47°24'10.7"N 19°02'56.2"E
    47°24'10"N 19°02'5"E
    47°30'0"N 19°01'0"E
    47°0'0"N 19°0'0"E*

  let res = null;
  let w = cor.match(/^([\d]{2})°([\d]{1,2})'([\d\.]+)"([NS]) ([\d]{2,3})°([\d]{1,2})'([\d\.]+)"([EW])$/);
  if(w){
    w=w.map(d=>parseFloat(d));
    let ns = w[4]==='S' ? -1 : 1;
    let ew = w[8]==='W' ? -1 : 1;
    let lat = parseFloat((w[1] + ((w[2] + (w[3] / 60)) / 60)) * ns);
    let lng = parseFloat((w[5] + ((w[6] + (w[7] / 60)) / 60)) * ew);
    res = {lat: lat.toFixed(6), lng: lng.toFixed(6)}
    //console.log('DMS', res)
  }
  return res;
}

const convertDDToLatLng=(cor)=>{
  let res = null;
  let fnd = cor.match(/^([\d]{2})[\.,]([\d]{1,15}), ?([\d]{2})[\.,]([\d]{1,15})$/);
  if(fnd){
    res = {lat: parseFloat(`${fnd[1]}.${fnd[2]}`).toFixed(6), lng: parseFloat(`${fnd[3]}.${fnd[4]}`).toFixed(6)}
    //console.log('DD', res);
  }
  return res;
}

const pasteCoordFromClipboard=async(e)=>{ 
  try{
    e.stopPropagation()
    let clipText= await navigator.clipboard.readText();
    let cor = clipText.match(/°/) ? convertDMSToLatLng(clipText) : convertDDToLatLng(clipText);
    if(cor){
      setCoordinate(cor);
    }
  } catch (err) {
    alert(err.message);
  }
}

const getSettlementName=async(cor)=>{
  try{
    const api = await fetch('https://www.overpass-api.de/api/interpreter?', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:`
      [out:json];\nis_in(${cor.lat},${cor.lng})->.a;
      (rel(pivot.a)[boundary=administrative]["admin_level"="8"];
      rel(pivot.a)[boundary=administrative]["admin_level"="9"];
      rel(pivot.a)[boundary=administrative]["admin_level"="10"];);
      out tags;`
    });
    const ans = await api.json();
    let res = null;
    let arr = ans.elements.map(d=> d.tags.name);
    if(arr.length>1){
      let dist = arr.find(d=>d.match(/kerület/));
      let suburb = arr.filter(d=>d!="Budapest")
      .filter(d=> !d.match(/kerület/))[0];
      if(dist){
        suburb = `${suburb} (${dist.replace(/ kerület/,"")})`;
      }
      res = ["Budapest", suburb];
    }
    else{
      res = arr;
    }
    return res;
  } catch (err) {
    alert(err.message);
  }
}

const setSettlement=async()=>{
  try{
    let selectedName = null;
    let tlp = document.getElementById("telepules");
    let stlName = await getSettlementName(marker.getLatLng());
    selectedName = stlName[0];
    if(stlName.length>1){
      let site = $("#terulet").val();
      $("#terulet").val(site ? `${stlName[1]}, ${site}` : stlName[1]);
    }
    for ( let i = 0; i < tlp.options.length; i++ ) {
      if (tlp.options[i].text == selectedName) {
        tlp.options[i].selected = tlp.options[i].value;
        return;
      }
    };
  } catch (err) {
    alert(err.message);
  }
}  

const setCoordinate=(c)=> {
  try{
    let cor = {lat: parseFloat(c.lat).toFixed(6), lng: parseFloat(c.lng).toFixed(6)}
    $("#longitude").val(cor.lat);
    $("#lattitude").val(cor.lng);
    mymap.getZoom()<13 ? mymap.flyTo(cor, 13) : mymap.flyTo(cor);
    marker
    .setLatLng(cor)
    .bindTooltip(`${cor.lat},${cor.lng}`);
  } catch (err) {
    alert(err.message);
  }
}

const cleanupForm=()=>{
  $("#fajId").select2("val", "-999");      
  $("#peldany").val("");
  $('#kor option[value="0"]').attr('selected', 'selected'); 
  $('#nem option[value="0"]').attr('selected', 'selected'); 
  $('#telepules option[value="0"]').attr('selected', 'selected'); 
  let sit = $("#terulet").val();
  sit = sit.replace(/^.* \([IVX]+\.\),?\s?/,"");
  sit = sit.replace(/^Margitsziget,?\s?/,"");
  $("#terulet").val(sit);     
  $('[name=megjegyzes]').val("");
  $('[name=foto]').val("");
  $("#longitude").val("");
  $("#lattitude").val("");
}

const submitForm=async()=>{
  await setSettlement()
  await new Promise((resolve)=>setTimeout(() => {
    resolve();
  }, 2000));
  cleanupForm();
  //formAdatfeltoltes()
}


//Törlendő
$(document).ready(function(){
  $("#telepules").select2({
  });
});

//disabled beszúrandó
`<select disabled id="telepules" name="telepules" ...`

//törölni
`... value="Megfigyelés feltöltése" onClick="return formAdatfeltoltes()"/>`
//helyette
`... value="Megfigyelés feltöltése" onClick="submitForm();event.preventDefault()"/>`
*/