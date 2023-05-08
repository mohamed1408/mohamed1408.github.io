const SAMPLE_DATA = [
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
  { Customer: "RIL JIO", CFC: 60, MDS: 60, BestCommit: 45, ProbableCommit: 35 },
  {
    Customer: "PHILIPS-US",
    CFC: 70,
    MDS: 70,
    BestCommit: 65,
    ProbableCommit: 50,
  },
  {
    Customer: "PHILIPS-MATC",
    CFC: 80,
    MDS: 80,
    BestCommit: 75,
    ProbableCommit: 60,
  },
  { Customer: "TEJAS", CFC: 50, MDS: 50, BestCommit: 45, ProbableCommit: 40 },
  { Customer: "GE HC", CFC: 50, MDS: 50, BestCommit: 45, ProbableCommit: 40 },
];

// const shadeColor = (color, percent) => {
//   var R = parseInt(color.substring(1, 3), 16);
//   var G = parseInt(color.substring(3, 5), 16);
//   var B = parseInt(color.substring(5, 7), 16);

//   R = parseInt((R * (100 + percent)) / 100);
//   G = parseInt((G * (100 + percent)) / 100);
//   B = parseInt((B * (100 + percent)) / 100);

//   R = R < 255 ? R : 255;
//   G = G < 255 ? G : 255;
//   B = B < 255 ? B : 255;

//   R = Math.round(R);
//   G = Math.round(G);
//   B = Math.round(B);

//   var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
//   var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
//   var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

//   return "#" + RR + GG + BB;
// };

var svg = d3.select("#piechart_1").append("svg").attr("id", "pie_chart").append("g");

svg.append("g").attr("class", "slices");
svg.append("g").attr("class", "labels");
svg.append("g").attr("class", "lines");
var margin = { top: 30, right: 30, bottom: 70, left: 60 };

var width = screen.width / 2 - margin.left - margin.right,
  height = screen.height * 0.75 - margin.top - margin.bottom,
  radius = Math.min(width, height) / 2;

var pie = d3
  .pie()
  .sort(null)
  .value(function (d) {
    return d.value;
  });

var arc = d3
  .arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.4);

var outerArc = d3
  .arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function (d) {
  return d.data.label;
};

var color = d3
  .scaleOrdinal()
  .domain(SAMPLE_DATA.map((x) => x.Customer))
  .range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56",
    "#d0743c",
    "#ff8c00",
    "#d0743c",
  ]);

function randomData() {
  console.log("Randomizing");
  var labels = color.domain();
  return SAMPLE_DATA.map(function (x) {
    return { label: x.Customer, value: Math.random() };
  });
}

d3.select(".randomize").on("click", function () {
  change(randomData());
});

function change(data) {
  /* ------- PIE SLICES -------*/
  var slice = svg
    .select(".slices")
    .selectAll("path.slice")
    .data(pie(data), key);

  slice
    .enter()
    .insert("path")
    .style("fill", function (d) {
      return shadeColor(color(d.data.label), 50);
    })
    .attr("stroke", function (d) {
      return color(d.data.label);
    })
    .attr("class", "slice");

  slice
    .transition()
    .duration(1000)
    .attrTween("d", function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        return arc(interpolate(t));
      };
    });

  slice.exit().remove();

  /* ------- TEXT LABELS -------*/

  var text = svg
    .select(".labels")
    .selectAll("text")
    .data(pie(data), key);

  text
    .enter()
    .append("text")
    .attr("dy", ".35em")
    .text(function (d) {
      return d.data.label;
    });

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  text
    .transition()
    .duration(1000)
    .attrTween("transform", function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      };
    })
    .styleTween("text-anchor", function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? "start" : "end";
      };
    });

  text.exit().remove();

  /* ------- SLICE TO TEXT POLYLINES -------*/

  var polyline = svg
    .select(".lines")
    .selectAll("polyline")
    .data(pie(data), key)
    .attr("stroke", "white");

  polyline.enter().append("polyline");

  polyline
    .transition()
    .duration(1000)
    .attrTween("points", function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      };
    });

  polyline.exit().remove();
//   svg.selectAll("text").style("color", "white")
}

change(
  SAMPLE_DATA.map(function (x) {
    return { label: x.Customer, value: x.MDS };
  })
);
change(
  SAMPLE_DATA.map(function (x) {
    return { label: x.Customer, value: x.MDS };
  })
);

