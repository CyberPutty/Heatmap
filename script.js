
let dataset2=[[20,45],[30,70],[100,50],[150,30],[70,35],[280,180],[15,30],[20,95]]
let dataset;
let padding= 200;
let width= 2000;
let height= 800+ padding;
let randomColor;
let baseTemp;



/// y months x years date format 
// color legend blue to red


function colorTemp(color){

    if (color){
        return "rgb("+color*1.5+","+color*1.2+","+color/3+")";
    }

}


function months(month){

    switch(month){

        case 1:
        return "January";
        case 2:
        return "February";
        case 3:
        return "March";
        case 4: 
        return "April";
        case 5:
        return "May";
        case 6:
        return "June";
        case 7:
        return "July";
        case 8:
        return "August";
        case 9: 
        return "September";
        case 10: 
        return "October";
        case 11: 
        return "November";
        case 12:
        return "December";
        case 0:
        return "";
        default:
        return;


    }


}
// cylclist data
document.addEventListener('DOMContentLoaded', function(){
    fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        dataset= data.monthlyVariance;
        baseTemp= data.baseTemperature;
     console.log(dataset);

        setChart();
    })
    
}
    
)



///d3 3 phase enter update remove

function setChart(){
   
let formatTime= d3.timeFormat("%B");
let parseTime= d3.timeParse("%B");

let parseFull= d3.timeFormat("%Y,%B")
let formatYear= d3.timeFormat("%Y");
let fullFormat= d3.timeFormat("%Y,%B");
let testDate= formatTime(new Date(dataset[1].year,dataset[1].month-1));
// new date()

let minTemp= d3.min(dataset, function(d){

    return d.variance;
});
let maxTemp= d3.max(dataset, function(d){
   return d.variance;
})

// 5   3 baseline  5 hot 1 cold  - 6.96min 5.228max;

let monthMax= months(12);

let monthMin= months(0);
console.log(monthMax);


let yearMax= new Date()

yearMax.setFullYear(d3.max(dataset, function(d){
   
    return d.year;
}));
let yearMin= new Date();
yearMin.setFullYear(  d3.min(dataset, function(d){
 
    return d.year;
}));  
/// problem occurs when using fullyear format. parses year date. needs to return month only format..


let chart= d3.select("#chart")
.append("svg")
.attrs({
    "width": width,
    "height": height
});
let xscale= d3.scaleTime();
xscale.domain([yearMin,yearMax]);
xscale.range([0,width-(padding*2)]);

let yscale= d3.scaleLinear();

yscale.domain([0,12]);
yscale.range([padding,height-padding]);
console.log(yscale(monthMax));



let colorscale= d3.scaleLinear();
colorscale.domain([minTemp,maxTemp]);
colorscale.range([0,255])

chart.append("text").text("Monthly Global Land-Surface Temperature")
.attrs({
    "class": "title",
    "x": (width/2),
    "y": padding/2,
    "text-anchor": "middle"
});

chart.append("text").text("1753-2015")
.attrs({
    "class": "subtitle",
    "x": (width/2),
    "y": padding/1.5,
    "text-anchor": "middle"
});
chart.append("text").text("Temperatures are in Celsius and reported as anomolies relative to the Jan-1951 to Dec-1980 average.")
.attrs({
    "class": "description",
    "x": (width/2),
    "y": padding/1.2,
    "text-anchor": "middle"
});
chart.append("text").html("Estimated Jan 1951-Dec 1980 absolute temperature &deg;C  8.66 +/- 0.07.")
.attrs({
    "class": "description",
    "x": (width/2),
    "y": padding/1.1,
    "text-anchor": "middle"
});



// if I map name data and store unique names in a list[] can create color chart for names.
chart.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attrs({
 "height": ((height-(padding*2))/12),
 "width": function(d){

     // yearmax-yearMin = number of years. /12 for months. 
   return (width+padding*2)/(formatYear(yearMax)-formatYear(yearMin));
 },
 "x": function(d,i){
     /// ... padding ......xscale ... padding / ................ total scale

     // total years xscale(yearMax-yearMin)
    return padding+ xscale(new Date().setFullYear(d.year));
 },
 "y": function(d,i){
     
   return yscale(d.month-1);
 },
 
 "fill": function (d){
     let color= colorTemp(colorscale(d.variance));
     
    return color;
 }

});

chart .selectAll("rect")
.on("mouseenter",function(d){

    let x= d3.mouse(this)[0];
    let y= d3.mouse(this)[1];
    if(!document.getElementById("tooltip")){
    

    chart.append("text")
   .html(d.variance)
   .attrs({
       "id": "tooltip",
       "x": x,
       "y": y
   });
   }


})
.on("mousemove",function(){
 
  let x= d3.mouse(this)[0];
  let y= d3.mouse(this)[1];

 
  let tooltip= document.getElementById("tooltip");
  
d3.select("#newline").attrs({
    "x": x,
    "y": y+20   
});
      d3.select("#tooltip").attrs({
    "x": x,
    "y": y   
   }); 
   

})
.on("mouseleave",function(){
    if(document.getElementById("tooltip")){
        
      d3.select("#tooltip").remove();
      
    }
   
});

/// needs to start 1 above

colorscale.range([0,200]);
let xAxis=d3.axisBottom(xscale).tickSizeInner([10]);
let yAxis=d3.axisLeft(yscale).tickSizeInner([10]).ticks(12).tickFormat(months);
let colorAxis= d3.axisBottom(colorscale).ticks(8);


chart.append("text").text("Month")
.attr("text-anchor","middle")
.attr("transform","translate("+padding/2+","+height/2+") rotate(-90)")
.attr("class","label");


// d3.select(".ylabel")
//  .attr("transform","rotate(-90)");


 chart.append("g")
.attr("class","yaxis")
.attr("transform","translate("+padding+",0)")
.call(yAxis);

chart.append("g")
.attr("class","xaxis")
.attr("transform","translate("+padding+","+(height-padding)+")")
.call(xAxis);

chart.append("g")
.attr("class","colorscale")
.attr("transform","translate("+(width-padding*2)+","+(height-75)+")")
.call(colorAxis);

chart.append("text").text("Year")
.attr("text-anchor","middle")
.attr("transform","translate("+width/2+","+padding*4.5+")")
.attr("class","label");

let legend= chart.append("defs").append("linearGradient").attr("id","legend");

legend.append("stop").attrs({
    "class": "stop1",
    "offset": "0%",
    "stop-color": function(){
        let color= colorTemp(colorscale(minTemp));
        return color;
    }
});

legend.append("stop").attrs({
    "class": "stop3",
    "offset": "100%",
    "stop-color": function(){
        let color=colorTemp(colorscale(maxTemp));
        console.log(color);
        return color;
    }
});
chart.append("rect")
.attrs({
    "width": 200,
    "height": 25,
    "x": width-padding*2,
    "y": height-100,
    "fill": "url(#legend)"
});


}
