import React, { useState, useEffect } from "react";
import "leaflet.locatecontrol";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import PropTypes from "prop-types";
import recycleBinIcon from "./recycle-bin.png";
import { getBinsData, getLatestObservation } from "./apiService";
// Import du composant de jauge
import Gauge from "./gauge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Home() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState([]);
  const [markerPositions, setMarkerPositions] = useState([]);
  const [binsData, setBinsData] = useState([]);
  const [observations, setObservations] = useState({});
  const [showGauge, setShowGauge] = useState(false); // Nouvel état pour contrôler l'affichage de la jauge

  useEffect(() => {
    getBinsData()
      .then((data) => {
        setBinsData(data);
        data.forEach((bin) => {
          getLatestObservation(bin["@iot.id"])
            .then((observation) => {
              setObservations((prevObservations) => ({
                ...prevObservations,
                [bin["@iot.id"]]: observation,
              }));
            })
            .catch((error) =>
              console.error("Failed to fetch latest observation.", error)
            );
        });
      })
      .catch((error) => console.error("Failed to fetch bins data.", error));
  }, []);

  const calculatePercentage = (value) => {
    if (value != null) {
      return value.toFixed(2);
    } else {
      return "N/A";
    }
  };

  const handleSectionClick = (section, image) => {
    setSelectedSection(section);
    setSelectedImage(image);

    let newData = [];
    let newMarkerPositions = [];

    switch (section) {
      case 0: // ALL
        newData = binsData.map((bin) => ({
          name: bin.name,
          result: observations[bin["@iot.id"]]
            ? observations[bin["@iot.id"]].result
            : 0,
        }));
        newMarkerPositions = binsData.map((bin) => [
          bin.properties.geometry.coordinates[1],
          bin.properties.geometry.coordinates[0],
        ]);
        setShowGauge(false); // Cacher la jauge pour la section ALL
        break;
      case 1: // FULL
        setShowGauge(true); // Afficher la jauge pour la section FULL
        newData = binsData
          .filter((bin) => observations[bin["@iot.id"]]?.result > 0.70)
          .map((bin) => ({
            name: bin.name,
            result: observations[bin["@iot.id"]].result,
          }));
        newMarkerPositions = binsData
          .filter((bin) => observations[bin["@iot.id"]]?.result > 0.70)
          .map((bin) => [
            bin.properties.geometry.coordinates[1],
            bin.properties.geometry.coordinates[0],
          ]);
        break;
      case 2: // PREDICTION
        // Logique pour la section PREDICTION
        setShowGauge(false); // Cacher la jauge pour la section PREDICTION
        break;
      default:
        break;
    }

    setData(newData);
    setMarkerPositions(newMarkerPositions);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const sections = [
    { title: "ALL BINS" },
    { title: "FULL BINS" },
    { title: "PREDICTION" }
  ];
  const fullBinsCount = binsData.filter(bin => observations[bin["@iot.id"]]?.result > 0.70).length;

  return (
    <main className="main-container">
      <div className="main-title">
        <h3 className="title">Dushbin Dashboard Status  </h3>
      </div>
      <div className="main-cards">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`card ${selectedSection === index ? "active" : ""}`}
            onClick={() => handleSectionClick(index)}
            style={{ textAlign: "center", display: "flex", alignItems: "center" }} // Ajoutez cette ligne pour centrer le texte verticalement
          >
            <div className="card-inner" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "2rem" }}>{section.title}</h3>
            </div>

          </button>
        ))}
      </div>
      {selectedSection !== null && (
        <div className="section-content" style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ textAlign: "center", fontSize: "2rem" }}>
              {sections[selectedSection].title}
            </h2>
            {selectedImage && (
              <img
                src={selectedImage}
                alt={`Image for ${sections[selectedSection].title}`}
              />
            )}
            {/* Condition pour afficher la jauge uniquement lorsque showGauge est vrai */}
            {showGauge && (
              <div className="gauge-box">
                <h2> </h2>
                <Gauge value={fullBinsCount} />
              </div>
            )}
            {/* Le reste du code pour les graphiques à barres */}
            {!showGauge && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  width={600}
                  height={400}
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tickFormatter={(value) => `${calculatePercentage(value)}%`}
                  />
                  <Tooltip
                    formatter={(value) => `${calculatePercentage(value)}%`}
                  />
                  <Legend />
                  <Bar dataKey="result" fill="#f5ee9e" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div style={{ flex: 1 }}>
             
              <MapContainer
                center={markerPositions[0] || [0, 0]}
                zoom={15}
                style={{ height: "600px", width: "600px", marginTop: "20px", marginLeft:'120px'}}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {markerPositions.map((coord, index) => (
                  <MyMarker key={index} coord={coord} index={index} />
                ))}
              </MapContainer>
            </div>

          </div>
        
      )}
    </main>
  );
}

function MyMarker({ coord, index }) {
  const [routingControl, setRoutingControl] = useState(null);
  const map = useMap();

  const handleMarkerClick = () => {
    map.locate().on("locationfound", (i) => {
      if (routingControl) {
        routingControl.getPlan().setWaypoints([]);
        map.removeControl(routingControl);
      }
      const waypoints = [
        L.latLng(i.latlng.lat, i.latlng.lng),
        L.latLng(coord[0], coord[1]),
      ];
      const routing = L.Routing.control({
        waypoints,
        lineOptions: {
          styles: [{ color: "blue", opacity: 0.7, weight: 5 }],
        },
      }).addTo(map);
      setRoutingControl(routing);
    });
  };

  return (
    <Marker
      key={index}
      position={coord}
      riseOnHover
      eventHandlers={{ click: handleMarkerClick }}
      icon={L.icon({
        iconUrl: recycleBinIcon,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })}
    >
      <Popup>{`Dushbin ${index + 1} - Point(${coord[0]}, ${coord[1]})`}</Popup>
    </Marker>
  );
}

MyMarker.propTypes = {
  coord: PropTypes.arrayOf(PropTypes.number).isRequired,
  index: PropTypes.number.isRequired,
};

export default Home;
