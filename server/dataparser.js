const fs = require("fs");

fs.readFile("data.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
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
              result[state][district][market][commodity] = marketData.filter(
                (item) => item.commodity === commodity
              );
            });
          });
        });
      });

      return result;
    }

    const nestedObject = createNestedObject(jsonData);
    const nestedJson = JSON.stringify(nestedObject, null, 2); // Use null, 2 for indented formatting

    fs.writeFile("nested_data1.json", nestedJson, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("Nested data written to nested_data.json");
      }
    });
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
  }
});
