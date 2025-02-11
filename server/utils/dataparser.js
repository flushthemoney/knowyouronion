const fs = require("fs");

function nestData(inputFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFilePath, "utf8", (err, data) => {
      if (err) {
        reject(new Error(`Error reading file: ${err.message}`));
        return;
      }

      try {
        const jsonData = JSON.parse(data);

        function createNestedObject(data) {
          const result = {};

          // Group by state
          const states = Array.from(new Set(data.map((item) => item.state)));
          states.forEach((state) => {
            result[state] = {};
            const stateData = data.filter((item) => item.state === state);

            // Group by district
            const districts = Array.from(
              new Set(stateData.map((item) => item.district))
            );
            districts.forEach((district) => {
              result[state][district] = {};
              const districtData = stateData.filter(
                (item) => item.district === district
              );

              // Group by market
              const markets = Array.from(
                new Set(districtData.map((item) => item.market))
              );
              markets.forEach((market) => {
                result[state][district][market] = {};
                const marketData = districtData.filter(
                  (item) => item.market === market
                );

                // Group by commodity
                const commodities = Array.from(
                  new Set(marketData.map((item) => item.commodity))
                );
                commodities.forEach((commodity) => {
                  result[state][district][market][commodity] =
                    marketData.filter((item) => item.commodity === commodity);
                });
              });
            });
          });

          return result;
        }

        const nestedObject = createNestedObject(jsonData);
        const nestedJson = JSON.stringify(nestedObject, null, 2);

        fs.writeFile(outputFilePath, nestedJson, (err) => {
          if (err) {
            reject(new Error(`Error writing file: ${err.message}`));
          } else {
            resolve(); // Resolve the promise on successful write
          }
        });
      } catch (parseError) {
        reject(new Error(`Error parsing JSON: ${parseError.message}`));
      }
    });
  });
}

module.exports = nestData;
