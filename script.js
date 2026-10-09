// ============================================
// VEHICLE EMISSION ESTIMATOR
// ============================================


// Emission Factors for Different Transportation Modes
// Illustrative values in kg CO2 per passenger-km.
const emissionFactors = {
    car: 0.192,
    bike: 0.103,
    bus: 0.089,
    train: 0.041
};
// Names and icons of Transportation Modes
const transportDetails = {
    car: { name: "🚗 Car", icon: "Car" },
    bike: { name: "🏍️ Bike", icon: "Bike" },
    bus: { name: "🚌 Bus", icon: "Bus" },
    train: { name: "🚆 Train", icon: "Train" }
};
// Get the Calculate Button from HTML
const calculateButton = document.getElementById("calculateBtn");
// Get the Result Paragraph from HTML
const resultText = document.getElementById("resultText");
// Get the Comparison Results Container from HTML
const comparisonResults =
    document.getElementById("comparisonResults");
// Get the Travel Insight Paragraph from HTML
const travelInsight =
    document.getElementById("travelInsight");
// When the Calculate Button Is Clicked
calculateButton.addEventListener("click", function () {
// Get the Selected Transportation Mode
const transport =
    document.getElementById("Transport").value;


// Get the Distance Travelled
const distance =
    Number(document.getElementById("Distance").value);


// Get the Number of Trips
const trips =
    Number(document.getElementById("Trips").value);


// Validate the User's Input
if (
    document.getElementById("Distance").value.trim() === "" ||
    document.getElementById("Trips").value.trim() === "" ||
    !Number.isFinite(distance) ||
    !Number.isFinite(trips) ||
    distance <= 0 ||
    trips <= 0
) {

    // Display an Error Message
    resultText.innerText =
        "Please enter a valid distance and number of trips.";

    // Clear Previous Comparison Results
    comparisonResults.innerHTML = "";

    // Reset the Travel Insight
    travelInsight.innerText =
        "Please enter valid journey details.";

    // Stop Further Calculation
    return;
}


// Calculate Emissions for the Selected Transportation Mode
const selectedEmission =
    distance * trips * emissionFactors[transport];


// Display the Selected Transportation Result
resultText.innerText =
    "Estimated CO₂ Emission: " +
    selectedEmission.toFixed(2) + " kg";


// Calculate Emissions for All Transportation Modes
const allResults = Object.keys(emissionFactors).map(function (mode) {

    // Calculate the Emission for This Mode
    const emission =
        distance * trips * emissionFactors[mode];

    // Return the Mode Name and Emission
    return {
        mode: mode,
        name: transportDetails[mode].name,
        emission: emission
    };
});


// Find the Highest Emission for Bar Scaling
const highestEmission = Math.max(
    ...allResults.map(function (item) {
        return item.emission;
    })
);


// Clear Previous Comparison Results
comparisonResults.innerHTML = "";


// Display a Comparison Bar for Each Transportation Mode
allResults.forEach(function (item) {

    // Calculate Bar Width as a Percentage
    const barWidth =
        (item.emission / highestEmission) * 100;


    // Create the Result Row
    const resultRow = document.createElement("div");
    resultRow.className = "transport-result";


    // Add the Mode Name and Emission Value
    resultRow.innerHTML = `
        <div class="transport-heading">
            <span>${item.name}</span>
            <span>${item.emission.toFixed(2)} kg CO₂</span>
        </div>

        <div class="bar-background">
            <div class="emission-bar"
                 style="width: ${barWidth}%">
            </div>
        </div>
    `;


    // Add the Result Row to the Comparison Section
    comparisonResults.appendChild(resultRow);
});


// Find the Transportation Mode with the Lowest Estimate
const lowestResult = allResults.reduce(function (lowest, item) {
    return item.emission < lowest.emission ? item : lowest;
});


// Find the Selected Mode's Emission
const selectedResult = allResults.find(function (item) {
    return item.mode === transport;
});


// Calculate the Difference from the Lowest-Emission Option
const difference =
    selectedResult.emission - lowestResult.emission;


// Display the Travel Insight
if (difference < 0.005) {

    // The Selected Mode Has the Lowest Estimate
    travelInsight.innerText =
        "Your selected mode, " + selectedResult.name +
        ", has the lowest estimated emissions among these options " +
        "for the journey details entered.";

} else {

    // Suggest Comparing with the Lowest-Emission Option
    travelInsight.innerText =
        "For the same journey, " + lowestResult.name +
        " has the lowest estimated emissions in this comparison. " +
        "Its estimate is " + lowestResult.emission.toFixed(2) +
        " kg CO₂, compared with " +
        selectedResult.emission.toFixed(2) +
        " kg CO₂ for your selected mode. Actual emissions can vary.";
}
});