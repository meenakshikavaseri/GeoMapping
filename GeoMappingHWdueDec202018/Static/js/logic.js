// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 25,
  id: "mapbox.light",
  accessToken: "pk.eyJ1IjoibWVlbmFrcm0iLCJhIjoiY2pwNW02bWR3MGVlbjNwcDRsem9tdWtjYiJ9.BZ6HXJBTJkYoThcMvipIow"
});



// Create the map object with options
var map = L.map("map-id", {
  center: [40.73, -74.0059],
  zoom: 12

});
lightmap.addTo(map)


function markerColor(magnitude) {
  if (magnitude > 5) {
    return "red"
  } else if (magnitude > 4) {
    return "pink"
  } else if (magnitude > 3) {
    return "orange"
  } else if (magnitude > 2) {
    return "yellow"
  } else if (magnitude > 1) {
    return "blue"
  } else {
    return "green"
  }
};

var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

  div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background-color:' + markerColor(grades[i] + 1) + '">..</i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);



//define URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function (error, data) {
  if (error) throw error;
  console.log("printing data: " + data);

  data.features.forEach(d => {
    var circle = L.circle([d.geometry.coordinates[1], d.geometry.coordinates[0]], {
      radius: d.properties.mag * 25000,
      fillColor: markerColor(d.properties.mag),
      fillOpacity: .6,
      color: "white",
      stroke: true,
      weight: .8,


    });
    circle.bindPopup(`<h2> ${d.properties.mag} <\h2>`)

    circle.addTo(map)
  })
});