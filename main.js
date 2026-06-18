const slides = document.querySelectorAll(".slide");

let current = 0;

function showSlide(index){

    slides.forEach(slide=>{
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");

    var page_text = document.getElementById("page")
    page_text.textContent = `${index + 1} / ${slides.length}`;

    page_text.style.color = (index + 1 == slides.length) ? "#4f8cff" : "black";
}

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight" || e.key.toLowerCase()==="p"){
        current = Math.min(
            current + 1,
            slides.length - 1
        );
    }

    if(e.key==="ArrowLeft" || e.key.toLowerCase()==="o"){
        current = Math.max(
            current - 1,
            0
        );
    }

    showSlide(current);
});

//////////////////////////////////////////////////////////////////////////
am5.ready(function() {

var root = am5.Root.new("spices_chart");

root.setThemes([
  am5themes_Animated.new(root)
]);

var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  paddingLeft: 0,
  layout: root.verticalLayout
}));

// 출처: https://repository.krei.re.kr/bitstream/2018.oak/24443/1/E03-2019-11-03.pdf
var data = [{
  "spice": "후추",
  "vietnam": 253,
  "indonecia": 87,
  "brazil": 79,
  "india": 72,
  "bulgaria": 55,
  "rest": 180
}, {
  "spice": "계피",
  "vietnam": 37,
  "indonecia": 87,
  "china": 79,
  "sriranca": 17,
  "madagaskar": 3,
  "rest": 81
}, {
  "spice": "정향",
  "indonecia": 124,
  "sriranca": 7,
  "madagaskar": 20,
  "tanzania": 9,
  "comoro": 3,
  "rest": 4
}];

var xRenderer = am5xy.AxisRendererX.new(root, {
  minorGridEnabled: true
});
var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "spice",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

xRenderer.grid.template.setAll({
  location: 1
})

xAxis.data.setAll(data);

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  max: 100,
  numberFormat: "#'%'",
  strictMinMax: true,
  calculateTotals: true,
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));

var legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.p50,
  x: am5.p50
}));

function makeSeries(name, fieldName) {
  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: name,
    stacked: true,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: fieldName,
    valueYShow: "valueYTotalPercent",
    categoryXField: "spice"
  }));

  series.columns.template.setAll({
    tooltipText: "{name}, {categoryX}:{valueYTotalPercent.formatNumber('#.#')}%",
    tooltipY: am5.percent(10)
  });
  series.data.setAll(data);

  series.appear();

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      sprite: am5.Label.new(root, {
        text: "{valueYTotalPercent.formatNumber('#.#')}%",
        fill: root.interfaceColors.get("alternativeText"),
        centerY: am5.p50,
        centerX: am5.p50,
        populateText: true
      })
    });
  });

  legend.data.push(series);
}

makeSeries("베트남", "vietnam");
makeSeries("인도네시아", "indonesia");
makeSeries("브라질", "brazil");
makeSeries("인도", "india");
makeSeries("중국", "china");
makeSeries("스리랑카", "srilanka");
makeSeries("마다가스카르", "madagascar");
makeSeries("탄자니아", "tanzania");
makeSeries("코모로", "comoros");
makeSeries("불가리아", "bulgaria");
makeSeries("나머지", "rest");

chart.appear(1000, 100);

}); // end am5.ready()

am5.ready(function() {

// Data
var groupData = [
{
  "name": "Af",
  "data": [
    { "id": "ID" }, // 인도네시아
    { "id": "LK" }  // 스리랑카
  ]
},
{
  "name": "Aw",
  "data": [
    { "id": "VN" }, // 베트남
    { "id": "BR" }, // 브라질
    { "id": "IN" }, // 인도
    { "id": "MG" }, // 마다가스카르
    { "id": "TZ" }, // 탄자니아
    { "id": "KM" }  // 코모로
  ]
},
{
  "name": "Cfa",
  "data": [
    { "id": "CN" }, // 중국
    { "id": "BG" }  // 불가리아
  ]
}
];

// Create root and chart
var root = am5.Root.new("spices_map");


// Set themes
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create chart
var chart = root.container.children.push(am5map.MapChart.new(root, {
  homeZoomLevel: 1,
  homeGeoPoint: { longitude: 0, latitude: 0 }
}));


// Create world polygon series
var worldSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
  geoJSON: am5geodata_worldLow,
  exclude: ["AQ"]
}));

worldSeries.mapPolygons.template.setAll({
  fill: am5.color(0xaaaaaa)
});

worldSeries.events.on("datavalidated", () => {
  chart.goHome();
});


// Add legend
var legend = chart.children.push(am5.Legend.new(root, {
  useDefaultMarker: true,
  centerX: am5.p50,
  x: am5.p50,
  centerY: am5.p100,
  y: am5.p100,
  dy: -20,
  background: am5.RoundedRectangle.new(root, {
    fill: am5.color(0xffffff),
    fillOpacity: 0.2
  })
}));

legend.valueLabels.template.set("forceHidden", true)


// Create series for each group
var colors = am5.ColorSet.new(root, {
  step: 2
});
colors.next();

am5.array.each(groupData, function(group) {
  var countries = [];
  var color = colors.next();

  am5.array.each(group.data, function(country) {
    countries.push(country.id)
  });

  var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
    geoJSON: am5geodata_worldLow,
    include: countries,
    name: group.name,
    fill: color
  }));


  polygonSeries.mapPolygons.template.setAll({
    tooltipText: "[bold]{name}[/]\nMember since {joined}",
    interactive: true,
    fill: color,
    strokeWidth: 2
  });

  polygonSeries.mapPolygons.template.states.create("hover", {
    fill: am5.Color.brighten(color, -0.3)
  });

  polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
    ev.target.series.mapPolygons.each(function(polygon) {
      polygon.states.applyAnimate("hover");
    });
  });

  polygonSeries.mapPolygons.template.events.on("pointerout", function(ev) {
    ev.target.series.mapPolygons.each(function(polygon) {
      polygon.states.applyAnimate("default");
    });
  });
  polygonSeries.data.setAll(group.data);

  legend.data.push(polygonSeries);
});

}); // end am5.ready()