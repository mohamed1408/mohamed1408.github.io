var margin = { top: 40, right: 100, bottom: 200, left: 100 },
  width = (screen.width * 3) / 4 - margin.left - margin.right,
  height = screen.height * 0.75 - margin.top - margin.bottom;
var legendMargin = { top: 10, right: 10, bottom: 10, left: 10 },
  lgndWidth = (screen.width * 1) / 4 - legendMargin.left - legendMargin.right,
  lgndHeight = screen.height * 0.75 - legendMargin.top - legendMargin.bottom;

const data = [
  {
    Customer: "BLOOM ENERGY",
    CFC: 50,
    MDS: 50,
    BestCommit: 45,
    ProbableCommit: 40,
  },
  { Customer: "NOKIA", CFC: 10, MDS: 10, BestCommit: 8, ProbableCommit: 7 },
  {
    Customer: "ROCHIE",
    CFC: 100,
    MDS: 100,
    BestCommit: 95,
    ProbableCommit: 80,
  },
  {
    Customer: "RIL JIO",
    CFC: 60,
    MDS: 60,
    BestCommit: 45,
    ProbableCommit: 35,
  },
  {
    Customer: "PHILIPS-US",
    CFC: 70,
    MDS: 70,
    BestCommit: 65,
    ProbableCommit: 50,
  },
  {
    Customer: "PHILIPS-MATC",
    CFC: 76,
    MDS: 76,
    BestCommit: 75,
    ProbableCommit: 60,
  },
  { Customer: "TEJAS", CFC: 50, MDS: 50, BestCommit: 45, ProbableCommit: 40 },
  { Customer: "GE HC", CFC: 87, MDS: 87, BestCommit: 45, ProbableCommit: 40 },
];

var svg = d3
  .select("#barchart_1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var lgndSVG = d3
  .select("#barchart_1_legend")
  .append("svg")
  .attr("width", lgndWidth + legendMargin.left + legendMargin.right)
  .attr("height", lgndHeight + legendMargin.top + legendMargin.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + legendMargin.left + "," + legendMargin.top + ")"
  );
var Tooltip = d3
  .select("#barchart_1")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip shadow")
  .style("color", "white")
  .style("background-color", "black")
  .style("border", "solid black")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px");
var mouseover = function (d) {
  Tooltip.style("opacity", 1);
  // d3.select(this)
  //   .style("stroke", "black")
  //   .style("opacity", 1)
};
var mousemove = function (event, d) {
  // console.log(d)
  Tooltip.html("Probable Commit: " + d.ProbableCommit)
    .style("left", event.clientX + 70 + "px")
    .style("top", event.clientY + "px");
};
var mouseleave = function (d) {
  Tooltip.style("opacity", 0);
  // d3.select(this)
  //   .style("stroke", "green")
};
const shadeColor = (color, percent) => {
  console.log(color);
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
};

const grouped_bar_chart = () => {
  // set the dimensions and margins of the graph

  // append the svg object to the body of the page

  // Parse the Data
  //   d3.csv(
  //     "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv"
  //   ).then(function (data) {
  // List of subgroups = header of the csv files = soil condition here
  var subgroups = ["CFC", "MDS", "BestCommit"];

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function (d) {
    return d.Customer;
  });

  // Add X axis
  var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .call((g) => g.selectAll(".domain").remove())
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(4)
        .tickSize(0)
        .tickFormat((x) => "$" + x)
    )
    .call((g) => g.selectAll(".domain").remove());
  // .selectAll("text")
  // .style("color", "white");
  // .selectAll("path")
  // .attr("stroke", "white");
  // Gridline
  var gridlines = d3
    .axisLeft()
    .ticks(4)
    .tickFormat("")
    .tickSize(-width)
    .scale(y);

  svg
    .append("g")
    .attr("class", "grid")
    .call(gridlines)
    .selectAll(".domain")
    .remove();
  svg.transition().duration(1000);

  const defs = svg.append("defs");
  const pattern = defs
    .append("pattern")
    .attr("id", `diagonalPattern`)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("height", 4)
    .attr("width", 4);
  pattern
    .append("path")
    .attr("stroke", "#7338fc")
    .attr("stroke-width", 1)
    .attr(
      "d",
      `M-1,1 l2,-2
      M0,4 l4,-4
      M3,5 l2,-2`
    );
  // Another scale for subgroup position?
  var xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.1]);

  // console.log(xSubgroup)
  svg.selectAll("text").style("font-size", xSubgroup.bandwidth() / 2);

  // color palette = one color per subgroup
  var color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#7338fc", "#cca7fb", "#e64d98"]); // , "#4daf4a"]);

  // Show the bars
  svg
    .append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + x(d.Customer) + ",0)";
    })
    .selectAll("rect")
    .data(function (d) {
      // console.log(d)
      return subgroups.map(function (key) {
        return { key: key, value: d[key], ProbableCommit: d.ProbableCommit };
      });
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      // console.log(d.key)
      // console.log(xSubgroup(d.key))
      return xSubgroup(d.key);
    })
    .attr("y", function (d) {
      console.log(y(d.value));
      console.log(y(d.value));
      return y(d.value);
    })
    .attr("rx", 5)
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("fill", function (d) {
      return color(d.key); //d.key == "BestCommit" ? "url('#diagonalPattern')" : color(d.key); // shadeColor(color(d.key), 200);
    })
    .attr("stroke", function (d) {
      return color(d.key);
    });
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#11174a")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.Customer) + xSubgroup("MDS") + xSubgroup.bandwidth() / 2;
        })
        .y(function (d) {
          return y(d.ProbableCommit);
        })
        .curve(d3.curveMonotoneX)
    );
  svg
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "cfc")
    .attr("text-anchor", "middle")
    .attr("font-size", xSubgroup.bandwidth() / 2)
    .attr("font-family", "Arial, Helvetica, sans-serif") //font-family="Arial, Helvetica, sans-serif"
    .attr("x", function (d) {
      return x(d.Customer) + xSubgroup("CFC") + xSubgroup.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return y(d.CFC) - 10;
    })
    .text(function (d) {
      return "$" + d.CFC;
    });

//   svg
//     .selectAll("text.cfc")
//     .data(data)
//     .enter()
//     .append("text")
//     .attr("class", "cfc")
//     .attr("text-anchor", "middle")
//     .attr("font-size", xSubgroup.bandwidth() / 2)
//     .attr("font-family", "Arial, Helvetica, sans-serif") //font-family="Arial, Helvetica, sans-serif"
//     .attr("x", function (d) {
//       return x(d.Customer) + xSubgroup("CFC") + xSubgroup.bandwidth() / 2;
//     })
//     .attr("y", function (d) {
//       return y(d.CFC) - 10;
//     })
//     .text(function (d) {
//       return "$" + d.CFC;
//     });
  svg
    .selectAll("text.mds")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "mds")
    .attr("text-anchor", "middle")
    .attr("font-size", xSubgroup.bandwidth() / 2)
    .attr("font-family", "Arial, Helvetica, sans-serif") //font-family="Arial, Helvetica, sans-serif"
    .attr("x", function (d) {
      return x(d.Customer) + xSubgroup("MDS") + xSubgroup.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return y(d.MDS) - 10;
    })
    .text(function (d) {
      return "$" + d.MDS;
    });
  svg
    .selectAll("text.best_commit")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "best_commit")
    .attr("text-anchor", "middle")
    .attr("font-size", xSubgroup.bandwidth() / 2)
    .style("color", "#98989a")
    .attr("font-family", "Arial, Helvetica, sans-serif") //font-family="Arial, Helvetica, sans-serif"
    .attr("x", function (d) {
      return (
        x(d.Customer) + xSubgroup("BestCommit") + xSubgroup.bandwidth() / 2
      );
    })
    .attr("y", function (d) {
      return y(d.BestCommit) - 10;
    })
    .text(function (d) {
      return "$" + d.BestCommit;
    });

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", "#11174a")
    .attr("class", "circle")
    .attr("stroke", "#11174a")
    .attr(
      "cx",
      (d) => x(d.Customer) + xSubgroup("MDS") + xSubgroup.bandwidth() / 2
    )
    .attr("cy", (d) => y(d.ProbableCommit))
    .attr("r", xSubgroup.bandwidth() / 8);

  svg
    .selectAll("rect")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  //   svg.selectAll("path").attr("stroke", "white");
  //   svg.selectAll("line").attr("stroke", "white");
  //   });

  lgndSVG
    .selectAll("lgndrects")
    .data(subgroups)
    .enter()
    .append("rect")
    .attr("x", 10)
    .attr("y", function (d, i) {
      return 100 + i * 55;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("rx", 7)
    .attr("width", xSubgroup.bandwidth() * 2)
    .attr("height", xSubgroup.bandwidth())
    .attr("stroke", function (d) {
      return color(d);
    })
    .style("fill", function (d) {
      return color(d); // d == "BestCommit" ? "url('#diagonalPattern')" : color(d);
    });

  // lgndSVG.selectAll("")

  lgndSVG
    .selectAll("mylabels")
    .data(subgroups)
    .enter()
    .append("text")
    .attr("x", xSubgroup.bandwidth() * 2 + 20)
    .attr("y", function (d, i) {
      return 100 + xSubgroup.bandwidth() / 2 + i * 55;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "#000000")
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  svg.selectAll("text").style("color", "#98989a");
};
grouped_bar_chart();
