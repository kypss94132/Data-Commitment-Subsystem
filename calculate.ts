import * as math from 'mathjs';
import mysql from 'mysql2/promise'; // Import mysql2 for async/await support

// **Database Connection Configuration**
const dbConfig = {
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: 'kypss94132',  // Replace with your MySQL password
  database: 'parser',  // Replace with your database name
};

// **Function to Fetch All Expressions from 'predicate' Table**
async function fetchExpressions(): Promise<string[]> {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute<any[]>('SELECT LeftOperand FROM predicate'); // Fetch ALL rows

    await connection.end(); // Close connection

    return rows.map(row => row.LeftOperand).filter(Boolean); // Extract expressions and remove nulls
  } catch (error) {
    console.error('Error fetching expressions:', error);
    return [];
  }
}

// **Function to Fetch Weather Data from 'weather' Table**
async function fetchWeatherData() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute<any[]>('SELECT * FROM weather');

    await connection.end(); // Close the connection

    if (!Array.isArray(rows)) {
      throw new Error("Unexpected database response format.");
    }

    // Extract DB columns into arrays
    const pressure = rows.map(row => row.pressure);
    const humidity = rows.map(row => row.humidity);
    const temperature = rows.map(row => row.temperature);
    const wind = rows.map(row => row.wind);
    const precipitation = rows.map(row => row.precipitation);
    
    //console.log("Fetched Weather Data:", { wind });
    return { pressure, humidity, temperature, wind, precipitation };
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { wind: [], precipitation: [], temperature: [] };
  }
}

// **Main Function: Fetch All Expressions, Fetch Data & Evaluate**
/*
async function main() {
  const expressions = await fetchExpressions(); // Get ALL expressions from DB
  if (expressions.length === 0) {
    console.log("No expressions found in database.");
    return;
  }

  const dbWeatherData = await fetchWeatherData();
  const weatherData = { weather: dbWeatherData };

  // Loop through and evaluate each expression
  for (const expression of expressions) {
    console.log(`Evaluating Expression: ${expression}`);
    console.log("Result:", evaluateExpression(expression, weatherData));
  }

}
*/
// **Main Function: Fetch Expressions, Fetch Data, Evaluate & Save Results**
async function main() {
  const expressions = await fetchExpressions(); // Get ALL expressions from DB
  if (expressions.length === 0) {
    console.log("No expressions found in database.");
    return;
  }

  const dbWeatherData = await fetchWeatherData();
  const weatherData = { weather: dbWeatherData };

  // Establish database connection
  const connection = await mysql.createConnection(dbConfig);

  for (const expression of expressions) {
    console.log(`Evaluating Expression: ${expression}`);
    
    const result = evaluateExpression(expression, weatherData);
    console.log("Result:", result);

    // **Save result into the `verification_data` table**
    try {
      await connection.execute(
        `UPDATE verification_data 
        SET CalculatedResult = ? 
        WHERE PredicateID IN (SELECT PredicateID FROM predicate WHERE LeftOperand = ?)
        `,
        [String(result), expression]
      );
      console.log(`Saved result for "${expression}" into database.`);
    } catch (error) {
      console.error(`Error saving result for "${expression}":`, error);
    }
  }

  // Close connection
  await connection.end();
}


// **Function to Extract and Evaluate Expressions**
function evaluateExpression(expression: string, weatherData: any): number | number[] | string | Record<string, number> | null {
  const match = expression.match(/(\w+)\(([\w.]+)\)/);
  if (!match) return null;

  const funcName = match[1]; // e.g., "Mean"
  const variablePath = match[2].split('.'); // e.g., ["weather", "precipitation"]

  let data: any = weatherData;
  for (const key of variablePath) {
    if (data && typeof data === "object" && key in data) {
      data = data[key];
    } else {
      return null;
    }
  }

  if (!Array.isArray(data) || data.length === 0) return null;

  switch (funcName.toLowerCase()) {
    case "average":
    case "mean":
      return Number(math.mean(data));
    case "median":
      return Number(math.median(data));
    case "mode":
      return mode(data);
    case "range":
      return Number(math.max(data)) - Number(math.min(data));
    case "maximumvalue":
      return Number(math.max(data));
    case "minimumvalue":
      return Number(math.min(data));
    case "standarddeviation":
      return Number(math.std(data));
    case "sum":
      return Number(math.sum(data));
    default:
      return null;
  }
}

// **Function to Calculate Mode**
function mode(arr: number[]): number | null {
  const freqMap: Record<number, number> = {};
  arr.forEach(num => freqMap[num] = (freqMap[num] || 0) + 1);
  let maxFreq = 0;
  let modeValue = null;
  for (const key in freqMap) {
    if (freqMap[key] > maxFreq) {
      maxFreq = freqMap[key];
      modeValue = Number(key);
    }
  }
  return modeValue;
}

// **Run the Main Function**
main();