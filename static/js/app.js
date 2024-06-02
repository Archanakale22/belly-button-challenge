const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
// Fetch the JSON data
d3.json(url).then(function(data) {
  // Populate the dropdown menu with the sample IDs
  var dropdownMenu = d3.select("#selDataset");
  data.names.forEach(name => {
    dropdownMenu.append("option").text(name).property("value");
  });

  // Initialize the dashboard with the first sample's data
  updatePlots(data.names[0]);
  updateMetadata(data.names[0]);
});
function updatePlots(id) {
  d3.json(url).then(function(data) {
    // Filter the data for the selected sample
    var sample = data.samples.filter(sample => sample.id === id)[0];

    // Create the bar chart
    var trace1 = {
      x: sample.sample_values.slice(0, 10).reverse(),
      y: sample.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text: sample.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    var data1 = [trace1];
    var layout1 = {
      title: 'TOP 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' }
    };
    Plotly.newPlot("bar", data1, layout1);

    // Create the bubble chart
    var trace2 = {
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: 'markers',
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids
      }
    };
    var data2 = [trace2];
    var layout2 = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };
    Plotly.newPlot('bubble', data2, layout2);
  });
}
function updateMetadata(id) {
  d3.json(url).then(function(data) {
    // Filter the data for the selected sample
    var metadata = data.metadata.filter(sample => sample.id == id)[0];

    // Display each key-value pair from the metadata JSON object
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Update the dashboard each time a new sample is selected
d3.selectAll("#selDataset").on("change", function() {
  var newID = d3.select(this).property("value");
  updatePlots(newID);
  updateMetadata(newID);
});
