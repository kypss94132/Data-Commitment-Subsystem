"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var math = require("mathjs");
// Sample weather data
var weatherData = {
    weather: {
        precipitation: [2, 5, 7, 3, 4, 10, 6, 8, 1, 9], // Example values
        temperature: [15, 18, 21, 16, 22, 25, 19, 23, 20, 17] // Example for regression
    }
};
// Function to calculate mode
function mode(arr) {
    var freqMap = {};
    arr.forEach(function (num) { return freqMap[num] = (freqMap[num] || 0) + 1; });
    var maxFreq = 0;
    var modeValue = null;
    for (var key in freqMap) {
        if (freqMap[key] > maxFreq) {
            maxFreq = freqMap[key];
            modeValue = Number(key);
        }
    }
    return modeValue;
}
// Function to extract and evaluate expressions
function evaluateExpression(expression) {
    var match = expression.match(/(\w+)\(([\w.]+)\)/);
    if (!match)
        return null;
    var funcName = match[1]; // e.g., "Mean"
    var variablePath = match[2].split('.'); // e.g., ["weather", "precipitation"]
    // Extract data dynamically
    var data = weatherData;
    for (var _i = 0, variablePath_1 = variablePath; _i < variablePath_1.length; _i++) {
        var key = variablePath_1[_i];
        if (data && typeof data === "object" && key in data) {
            data = data[key];
        }
        else {
            return null;
        }
    }
    // Ensure data is an array
    if (!Array.isArray(data))
        return null;
    // Compute result based on function name
    switch (funcName.toLowerCase()) {
        case "median":
            return Number(math.median(data));
        case "mean":
            return Number(math.mean(data));
        case "rowsmean":
            return Number(math.mean(data)); // Same as Mean in this context
        case "mode":
            return mode(data);
        case "range":
            return Number(math.max(data)) - Number(math.min(data));
        case "maximumvalue":
            return Number(math.max(data));
        case "minimumvalue":
            return Number(math.min(data));
        case "topvaluesnumeric":
            return __spreadArray([], data, true).sort(function (a, b) { return b - a; }).slice(0, 3); // Top 3 highest
        case "topvaluesnonnumeric":
            return "Not implemented for non-numeric values";
        case "headvalues":
            return data.slice(0, 5); // First 5 elements
        case "standarddeviation": {
            var stdValue = math.std(data);
            return Array.isArray(stdValue) ? Number(stdValue[0]) : Number(stdValue);
        }
        case "interquartilerange":
            return Number(math.subtract(math.quantileSeq(data, 0.75), math.quantileSeq(data, 0.25)));
        case "summarynumerical":
            return {
                mean: Number(math.mean(data)),
                median: Number(math.median(data)),
                std: (function () {
                    var stdValue = math.std(data);
                    return Array.isArray(stdValue) ? Number(stdValue[0]) : Number(stdValue);
                })(),
                min: Number(math.min(data)),
                max: Number(math.max(data)),
                range: Number(math.max(data)) - Number(math.min(data))
            };
        case "sum":
            return Number(math.sum(data));
        case "quantile":
            return {
                Q1: Number(math.quantileSeq(data, 0.25)),
                Q2: Number(math.median(data)),
                Q3: Number(math.quantileSeq(data, 0.75))
            };
        case "distributiontype":
            return "Assume normal distribution"; // Placeholder
        case "linearregression":
            return JSON.stringify(linearRegression(weatherData.weather.precipitation, weatherData.weather.temperature));
        case "logisticregression":
            return JSON.stringify(logisticRegression(weatherData.weather.precipitation, weatherData.weather.temperature));
        default:
            return null;
    }
}
// Function for simple linear regression (y = mx + b)
function linearRegression(x, y) {
    if (x.length !== y.length)
        return null;
    var n = x.length;
    var sumX = math.sum(x);
    var sumY = math.sum(y);
    var sumXY = math.sum(x.map(function (xi, i) { return xi * y[i]; }));
    var sumX2 = math.sum(x.map(function (xi) { return xi * xi; }));
    var slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    var intercept = (sumY - slope * sumX) / n;
    return { slope: slope, intercept: intercept };
}
// Function for simple logistic regression (sigmoid function based prediction)
function logisticRegression(x, y) {
    if (x.length !== y.length)
        return null;
    // Dummy coefficients for illustration (actual logistic regression would require iteration)
    var coefficients = x.map(function (xi) { return 1 / (1 + Math.exp(-xi)); }); // Sigmoid function
    return { coefficients: coefficients };
}
// Example usage
console.log("Mean:", evaluateExpression("Mean(weather.precipitation)"));
console.log("Median:", evaluateExpression("Median(weather.precipitation)"));
console.log("Mode:", evaluateExpression("Mode(weather.precipitation)"));
console.log("Range:", evaluateExpression("Range(weather.precipitation)"));
console.log("Max:", evaluateExpression("MaximumValue(weather.precipitation)"));
console.log("Min:", evaluateExpression("MinimumValue(weather.precipitation)"));
console.log("Standard Deviation:", evaluateExpression("StandardDeviation(weather.precipitation)"));
console.log("IQR:", evaluateExpression("InterquartileRange(weather.precipitation)"));
console.log("Top 3 Numeric:", evaluateExpression("TopValuesNumeric(weather.precipitation)"));
console.log("Head Values:", evaluateExpression("HeadValues(weather.precipitation)"));
console.log("Sum:", evaluateExpression("Sum(weather.precipitation)"));
console.log("Quantiles:", evaluateExpression("Quantile(weather.precipitation)"));
console.log("Summary Stats:", evaluateExpression("SummaryNumerical(weather.precipitation)"));
console.log("Linear Regression:", evaluateExpression("LinearRegression(weather.precipitation)"));
console.log("Logistic Regression:", evaluateExpression("LogisticRegression(weather.precipitation)"));
