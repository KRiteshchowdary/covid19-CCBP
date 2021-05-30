// ----------------------------------------------
// ---------------- MY CODE ---------------------
// ----------------------------------------------

// const express = require("express");
// const { open } = require("sqlite");
// const sqlite3 = require("sqlite3");
// const path = require("path");

// const app = express();

// app.use(express.json());

// let db = null;

// const initializeDbAndServer = async () => {
//   try {
//     db = await open({
//       filename: path.join(__dirname, "covid19India.db"),
//       driver: sqlite3.Database,
//     });
//     app.listen(3000, () =>
//       console.log("Server Running at http://localhost:3000/")
//     );
//   } catch (e) {
//     console.log(`DB Error: ${e.message}`);
//     process.exit(1);
//   }
// };

// initializeDbAndServer();

// module.exports = app;

// // API's

// // API 1 - Return All States

// app.get("/states/", async (request, response) => {
//   const getStatesQuery = `SELECT * FROM state`;
//   const statesArray = await db.all(getStatesQuery);
//   response.send(
//     statesArray.map((eachState) => ({
//       stateId: eachState.state_id,
//       stateName: eachState.state_name,
//       population: eachState.population,
//     }))
//   );
// });

// // API 2 - Return a State

// app.get("/states/:stateId/", async (request, response) => {
//   const { stateId } = request.params;
//   const getStateQuery = `SELECT * FROM state WHERE state_id=${stateId}`;
//   const state = await db.get(getStateQuery);
//   response.send({
//     stateId: state.state_id,
//     stateName: state.state_name,
//     population: state.population,
//   });
// });

// // API 3 - Create a District

// app.post("/districts/", async (request, response) => {
//   const { districtName, stateId, cases, cured, active, deaths } = request.body;
//   const createDistrictQuery = `INSERT INTO district (district_name,state_id,cases,cured,active,deaths) VALUES ("${districtName}",${stateId},${cases},${cured},${active},${deaths});`;
//   await db.run(createDistrictQuery);
//   response.send("District Successfully Added");
// });

// // API 4 - Return a District

// app.get("/districts/:districtId/", async (request, response) => {
//   const { districtId } = request.params;
//   const getDistrictQuery = `SELECT * FROM district WHERE district_id=${districtId};`;
//   const district = await db.get(getDistrictQuery);
//   response.send({
//     districtId: district.district_id,
//     districtName: district.district_name,
//     stateID: district.state_id,
//     cases: district.cases,
//     cured: district.cured,
//     active: district.active,
//     deaths: district.deaths,
//   });
// });

// // API 5 - Delete District

// app.delete("/districts/:districtId/", async (request, response) => {
//   const { districtId } = request.params;
//   const deleteDistrictQuery = `DELETE FROM district WHERE district_id=${districtId}`;
//   await db.get(deleteDistrictQuery);
//   response.send("District Removed");
// });

// // API 6 - Update District

// app.put("/districts/:districtId/", async (request, response) => {
//   const { districtId } = request.params;
//   const { districtName, stateId, cases, cured, active, deaths } = request.body;
//   const updateDistrictQuery = `UPDATE district SET district_name="${districtName}",state_id=${stateId},cases=${cases},cured=${cured},active=${active},deaths=${deaths} WHERE district_id=${districtId};`;
//   await db.run(updateDistrictQuery);
//   response.send("District Details Updated");
// });

// // API 7 - Return Statistics of a State

// app.get("/states/:stateId/stats/", async (request, response) => {
//   const { stateId } = request.params;
//   const getStatsQuery = `SELECT
//                             state_id,
//                             sum(cases) AS totalCases,
//                             sum(cured) AS totalCured,
//                             sum(active) AS totalActive,
//                             sum(deaths) AS totalDeaths
//                         FROM
//                             district
//                         GROUP BY
//                             state_id
//                         HAVING
//                             state_id=${stateId};
//                         `;
//   const stateStats = await db.get(getStatsQuery);
//   response.send({
//     totalCases: stateStats.totalCases,
//     totalCured: stateStats.totalCured,
//     totalActive: stateStats.totalActive,
//     totalDeaths: stateStats.totalDeaths,
//   });
// });

// // API 8 - Return State Name of District

// app.get("/districts/:districtId/details/", async (request, response) => {
//   const { districtId } = request.params;
//   const getStateNameQuery = `SELECT
//                                 state.state_name AS stateName
//                             FROM
//                                 district INNER JOIN state ON district.state_id=state.state_id
//                             WHERE
//                                 district_id = ${districtId};
//                             `;
//   const stateNameDistrict = await db.get(getStateNameQuery);
//   response.send(stateNameDistrict);
// });

// ----------------------------------------------
// ---------------- SOLUTION --------------------
// ----------------------------------------------

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "covid19India.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertStateDbObjectToResponseObject = (dbObject) => {
  return {
    stateId: dbObject.state_id,
    stateName: dbObject.state_name,
    population: dbObject.population,
  };
};

const convertDistrictDbObjectToResponseObject = (dbObject) => {
  return {
    districtId: dbObject.district_id,
    districtName: dbObject.district_name,
    stateId: dbObject.state_id,
    cases: dbObject.cases,
    cured: dbObject.cured,
    active: dbObject.active,
    deaths: dbObject.deaths,
  };
};

app.get("/states/", async (request, response) => {
  const getStatesQuery = `
    SELECT
      *
    FROM
      state;`;
  const statesArray = await database.all(getStatesQuery);
  response.send(
    statesArray.map((eachState) =>
      convertStateDbObjectToResponseObject(eachState)
    )
  );
});

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getStateQuery = `
    SELECT 
      *
    FROM 
      state 
    WHERE 
      state_id = ${stateId};`;
  const state = await database.get(getStateQuery);
  response.send(convertStateDbObjectToResponseObject(state));
});

app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getDistrictsQuery = `
    SELECT
      *
    FROM
     district
    WHERE
      district_id = ${districtId};`;
  const district = await database.get(getDistrictsQuery);
  response.send(convertDistrictDbObjectToResponseObject(district));
});

app.post("/districts/", async (request, response) => {
  const { stateId, districtName, cases, cured, active, deaths } = request.body;
  const postDistrictQuery = `
  INSERT INTO
    district (state_id, district_name, cases, cured, active, deaths)
  VALUES
    (${stateId}, '${districtName}', ${cases}, ${cured}, ${active}, ${deaths});`;
  await database.run(postDistrictQuery);
  response.send("District Successfully Added");
});

app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const deleteDistrictQuery = `
  DELETE FROM
    district
  WHERE
    district_id = ${districtId} 
  `;
  await database.run(deleteDistrictQuery);
  response.send("District Removed");
});

app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const updateDistrictQuery = `
  UPDATE
    district
  SET
    district_name = '${districtName}',
    state_id = ${stateId},
    cases = ${cases},
    cured = ${cured},
    active = ${active}, 
    deaths = ${deaths}
  WHERE
    district_id = ${districtId};
  `;

  await database.run(updateDistrictQuery);
  response.send("District Details Updated");
});

app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const getStateStatsQuery = `
    SELECT
      SUM(cases),
      SUM(cured),
      SUM(active),
      SUM(deaths)
    FROM
      district
    WHERE
      state_id=${stateId};`;
  const stats = await database.get(getStateStatsQuery);
  response.send({
    totalCases: stats["SUM(cases)"],
    totalCured: stats["SUM(cured)"],
    totalActive: stats["SUM(active)"],
    totalDeaths: stats["SUM(deaths)"],
  });
});

app.get("/districts/:districtId/details/", async (request, response) => {
  const { districtId } = request.params;
  const getStateNameQuery = `
    SELECT
      state_name
    FROM
      district
    NATURAL JOIN
      state
    WHERE 
      district_id=${districtId};`;
  const state = await database.get(getStateNameQuery);
  response.send({ stateName: state.state_name });
});

module.exports = app;
