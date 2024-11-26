import React, { useState, useEffect } from "react";
import { Table, HeaderRow, HeaderCell, Body, Row, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getBinsData, getLatestObservation } from "./apiService";
import './Products.css'
import './App.css'

function Product() {
  const [binsData, setBinsData] = useState([]);
  const [observations, setObservations] = useState({});

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

  const theme = useTheme({
    // Votre thème personnalisé ici
  });

  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const calculatePercentage = (value) => {
    if (value != null) {
      return value.toFixed(2);
    } else {
      return "N/A";
    }
  };

  return (
    <div className="page-content">
      <h1 className="title">TrashBin Information</h1>
      <div className="table-container"> {/* Encapsuler la table dans un div avec une classe pour centrer */}
        <Table
          data={{ nodes: binsData }}
          theme={theme}
          layout={{ fixedHeader: true }}
        >
          {(tableList) => (
            <>
              <HeaderRow>
                <HeaderCell resize>Id</HeaderCell>
                <HeaderCell resize>Name</HeaderCell>
                <HeaderCell resize>Description</HeaderCell>
                <HeaderCell resize>Location</HeaderCell>
                <HeaderCell resize>Phenomenon Time</HeaderCell>
                <HeaderCell resize>Result Time</HeaderCell>
                <HeaderCell resize>Result</HeaderCell>
              </HeaderRow>
              <Body>
                {tableList.map((bin) => (
                  <Row key={bin["@iot.id"]} item={bin}>
                    <Cell>{bin["@iot.id"]}</Cell>
                    <Cell>{bin.name}</Cell>
                    <Cell>{bin.description}</Cell>
                    <Cell>
                      {bin.properties.geometry?.type
                        ? ` ${bin.properties.geometry.type}(${bin.properties.geometry.coordinates.join(",")})`
                        : "N/A"}
                    </Cell>
                    <Cell>
                      {observations[bin["@iot.id"]]
                        ? formatDate(observations[bin["@iot.id"]].phenomenonTime)
                        : "N/A"}
                    </Cell>
                    <Cell>
                      {observations[bin["@iot.id"]]
                        ? formatDate(observations[bin["@iot.id"]].resultTime)
                        : "N/A"}
                    </Cell>
                    <Cell>
                      {observations[bin["@iot.id"]]
                        ? calculatePercentage(observations[bin["@iot.id"]].result)
                        : "N/A"}
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </div>
    </div>
  );
}

export default Product;
