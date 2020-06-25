console.log("Checkpoint 1");

//Global Variables
//Select the dropdown list with D3
var dropDownList = d3.select("#selDataset");
// This initializes the variable to the drop-down selection
var dropdownSelection = "";
//This initializes a global variable for all the Metadata inside the JSON data file
var theMetadata = [];


//This function initiales the program
function init() {

    //This sets up the drop-down options
    // Resetting the dropdown list in case of changes to any options
    resetDropdownList();
}


// This function sets up the drop-down options
function resetDropdownList() {

    // First, read the JSON file with the data
    d3.json("samples.json").then((dataFromJSON) => {
        //Read the data from the JSON with the ids
        var ids = dataFromJSON.names;

        //Check to see the ids are coming in at this step
        console.log(ids);

        //Clear the dropdown list of old list
        dropDownList.html("");

        //Put all those ids into the dropdown menu
        ids.forEach(element => {
            dropDownList.append("option").text(element).property("value", element);

        });
    });
};



console.log("Checkpoint 2");

// This function is called when a dropdown menu item is selected
function optionChanged(individual) {
    console.log("Checkpoint 4");

    // // Assign the value of the dropdown menu option to a variable
    // //Save the value that was chosen from the dropdown list
    // dropdownSelection = dropDownList.property("value");

    // Plotly.plot("pie", 0, 0)
    // Plotly.plot("bar", 0, 0)
    // Plotly.plot("bubble", 0, 0)


    doMetaDataChart(individual);
    makeCharts(individual);
    console.log("Checkpoint 5");
}

console.log("Checkpoint 3");


//This zips arrays together
function zipArray(array1, array2) {
    var zipped = array1.map(function (e, i) {
        return [e, array2[i]];
    });
    return zipped;
}

//This unpacks are pulls just the part you want from a JSON
function unpack(rows, index) {
    return rows.map(function (row) {
        return row[index];
    });
}


//Make the otu_labels into a better looking string with OTU in front
function addOTUstring(array) {
    var otu_labels = [];
    for (var i = 0; i < array.length; i++) {
        otu_labels.push("OTU " + array[i]);
    }
    return otu_labels;
}

//This functions makes the bubble, horizontal bar, and pie charts
function makeCharts(individual) {

    console.log("Checkpoint 7");

    // First, read the JSON file with the data
    d3.json("samples.json").then((data) => {


        // Populate the metadata of everything in that key of the JSON
        var theSampleData = data.samples;
        var individualFilteredSample = theSampleData.filter(dummy => dummy.id == individual);
        console.log(individualFilteredSample);


        // Pull out the information you want from the JSON dataset after filtering
        var sample_values = individualFilteredSample[0].sample_values;
        var otu_labels = individualFilteredSample[0].otu_labels;
        var number_otu_ids = individualFilteredSample[0].otu_ids;

        //Make the otu_labels into a better looking string with OTU in front
        var otu_ids = addOTUstring(number_otu_ids);

        console.log(otu_ids);
        console.log(otu_labels);
        console.log(sample_values);

        // ZIP THE arrays ALL TOGETHER
        idNlabelArray = zipArray(otu_ids, otu_labels);
        console.log(idNlabelArray);
        all3Array = zipArray(sample_values, idNlabelArray);
        console.log(all3Array);

        //SORT by the sample_values to get the top ten later
        sortedAll = all3Array.sort(function (a, b) { return b - a });
        console.log(sortedAll);

        //Unpack after sorting 
        var sorted_sample_values = unpack(sortedAll, 0);
        console.log(sorted_sample_values);

        var sorted_otu_ids = unpack(unpack(sortedAll, 1), 0);
        console.log(sorted_otu_ids);

        var sorted_otu_labels = unpack(unpack(sortedAll, 1), 1);
        console.log(sorted_otu_labels);


        // Note that the instructions have pie charts in the pictures instead of horizontal bar charts, 
        // so I made both.

        // Here the function slice() is being used to take the first ten samples for the pie chart,
        // Set up the pie chart layout
        var pieLayout = {
            margin: { t: 0, l: 0 }
        };

        // Set up the pie chart data formatting for the first ten samples
        var pieTrace = [
            {
                values: sorted_sample_values.slice(0, 10),
                labels: sorted_otu_ids.slice(0, 10),
                hovertext: sorted_otu_labels.slice(0, 10),
                hoverinfo: "hovertext",
                type: "pie"
            }
        ];

        //Display Chart where tagged
        Plotly.newPlot("pie", pieTrace, pieLayout)


        // Set up the horizontal bar chart trace object
        var horizTrace = [{
            x: sorted_sample_values.slice(0, 10),
            y: sorted_otu_ids.slice(0, 10),
            text: sorted_otu_labels.slice(0, 10),
            type: 'bar',
            orientation: 'h'
        }];

        // Set up the horizontal bar chart layout
        var horizLayout = {
            margin: {
                l: 100,
                r: 10,
                t: 0,
                b: 30
            },
            yaxis: {
                autorange: 'reversed'
            }
        }

        //Display Chart where tagged
        Plotly.newPlot("bar", horizTrace, horizLayout);


        // Set up the bubble chart layout
        var bubbleLayout = {
            margin: { t: 0 },
            hovermode: "closests",
            xaxis: { title: "OTU ID" }
        };

        // Set up bubble chart data formatting
        var bubbleTrace = [
            {
                x: number_otu_ids,
                y: sample_values,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                },
                text: otu_labels
            }
        ];

        //Display Chart where tagged
        Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);
    })
}

function doMetaDataChart(individual) {
    console.log("Checkpoint 6");

    // First, read the JSON file with the data
    d3.json("samples.json").then((data) => {
        // Populate the metadata of everything in that key of the JSON
        theMetadata = data.metadata;



        // This filters the full Metadata array from the JSON for just the individual that was selected
        // NOTE: It could be that the id in Metadata is an integer so we need to convert using the + operator,  ==== +
        var individualFilteredMetadata = theMetadata.filter(meta => meta.id == individual);
        console.log(individualFilteredMetadata);

        console.log(theMetadata);

        // This sets up all the information that you want to put into the panel that holds all the demographic information
        var demographic1 = 'ID Number: ' + individualFilteredMetadata[0].id;
        var demographic2 = 'Ethnicity: ' + individualFilteredMetadata[0].ethnicity;
        var demographic3 = 'Gender: ' + individualFilteredMetadata[0].gender;
        var demographic4 = 'Age: ' + individualFilteredMetadata[0].age;
        var demographic5 = 'Location: ' + individualFilteredMetadata[0].location;
        var demographic6 = 'BB-Type: ' + individualFilteredMetadata[0].bbtype;
        var demographic7 = 'W-Freq: ' + individualFilteredMetadata[0].wfreq;

        // The pulls the html element that you want to add the information into and display
        var demographicHTMLelement = document.getElementById('sample-metadata');

        // Uses the innerHTML function to insert the demographic info as lines in the correct html element
        demographicHTMLelement.innerHTML = demographic1 + '<br>' +
            demographic2 + '<br>' +
            demographic3 + '<br>' +
            demographic4 + '<br>' +
            demographic5 + '<br>' +
            demographic6 + '<br>' +
            demographic7;
    });
}

init();

