function initial() {
  
  var selector=d3.select("#selDataset");

  //Initialising the webpage, populating the dropdown menu and making sure the webpage fills all the graphs. 
  //Panel Data and Gauge are updated together as both use the metadata key. The other graphs use the sample key
  //Updating the panel and gauge is one function and updating the other two graphs is the other function. 

  d3.json("data/samples.json").then(function(data) {
    var names = data.names;
    names.forEach((name)=> {
      selector
      .append("option")
      .append("value")
      .text(name)
      .property("value", name)
    });

    var first_panel= data.metadata[0];
    var first_graph=data.samples[0];

    updateGraph(first_graph);
    updatePanelGauge(first_panel);
  })

  

  


 //setting up a variable for each needed drop down va

  }

    // Call optionChanged when a change takes place to the dropdown 
    d3.select("#selDataset").on("change", optionChanged);

    function optionChanged() {
      // Use D3 to select the dropdown menu
      var selector=d3.select("#selDataset");
      // Assign the value of the dropdown menu option to a variable
      var dropdown_value = selector.property("value");

      //looping through all the names in order to match the two ids
  
      d3.json("data/samples.json").then(function(data) {
        for (i = 0; i < data.metadata.length; i++){
          if (data.metadata[i].id==dropdown_value){
            var panel_data=data.metadata[i];
            var graph_data=data.samples[i];
  
            updateGraph(graph_data);
            updatePanelGauge(panel_data);
          }
        }
      });

  //Discuss adding in the data labels here
  //Here both the Panel and the Gauge are updated 

  

  
}

//Updating bar chart 
function updateGraph(newdata) {
  var otu_ids=newdata.otu_ids.slice(0, 10).reverse();
  var otu_ids_all=newdata.otu_ids;
  // converting the variable to a string
  var otu_ids2=otu_ids.map(String)

  //editing the OTU IDS
  for(var i=0;i<otu_ids2.length;i++){
    otu_ids2[i]="OTU "+otu_ids2[i];
  }

  //two values one for the 10 needed in order to do the bar chart, and all OTU values needed for the bubble chart 
  var sample_values=newdata.sample_values.slice(0, 10).reverse();
  var sample_values_all=newdata.sample_values;

  var otu_labels=newdata.otu_labels.slice(0, 10).reverse();
  var otu_labels_all=newdata.otu_labels;



  var trace1 ={
    x: sample_values,
    y: otu_ids2,
    text: otu_labels,
    name: "Greek",
    type: "bar",
    orientation: "h"
  };

  var layout = {
    title: 'Top Ten OTU IDs',
    showlegend: false,
    hovermode: 'closest',
    xaxis: {title:"Sample Values" },
    margin: {t:30}
  };


  var bar_chart = [trace1];



  Plotly.newPlot("bar", bar_chart, layout);

  var trace2 = {
    x: otu_ids_all,
    y: sample_values_all,
    text: otu_labels_all,
    mode: 'markers',
    marker: {
      color: otu_ids_all,
      size: sample_values_all,
      colorscale:'YlGnBu'
    }
  };

  var bubble_chart = [trace2];

  var layout = {
    title: 'Bacteria Cultures per Sample',
    showlegend: false,
    hovermode: 'closest',
    xaxis: {title:"OTU ID" },
    margin: {t:30}
  };


  Plotly.newPlot('bubble', bubble_chart, layout);


}

function updatePanelGauge(newdata) {
  var panel_select=d3.select("#sample-metadata");
  d3.select("#sample-metadata").html("");
//updating panel by looping through the dictionary and outputting the key and the value
  for (const [key, value] of Object.entries(newdata)) {
    panel_select
    .append("p")
    .text(`${key}: ${value}`)
  }

  var wfreq= newdata.wfreq

  //Updating the Gauge Chart 

  var data = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: wfreq,
      title: { text: "Washing Frequency" },
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 4], color: "cyan" },
          { range: [4, 9], color: "royalblue" }
        ],
      }
    }
  ];
  
  var layout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "lavender",
    font: { color: "darkblue", family: "Arial" }
  };
  
  Plotly.newPlot('gauge', data, layout);



  





}


initial();

