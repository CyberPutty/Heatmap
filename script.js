
let dataset2=[[20,45],[30,70],[100,50],[150,30],[70,35],[280,180],[15,30],[20,95]]
let dataset;
let padding= 200;
let width= 1500;
let height= 800+ padding;
let randomColor;




/// y months x years date format 
// color legend blue to red
























// cylclist data
document.addEventListener('DOMContentLoaded', function(){
    fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        dataset= data;
        randomColor= filterNames(dataset);

        setChart();
    })
    
}
    
);

function randomInt(min, max) {
    return min + Math.floor(Math.random() * (Math.floor(max) - min));
  }


function filterNames(arr){
    console.log(arr);
let uniqueNames=[];
let colors=[];


    arr.map(function(d){
let count=0;
if (uniqueNames.indexOf(d.Name)===-1){
    uniqueNames.push(d.Name);
    colors.push("rgb("+randomInt(0,255)+","+randomInt(0,255)+","+randomInt(0,255)+")");
}

});

return [uniqueNames,colors];
}

// maxtime will always be greatest overall time only need to subtract from max.
function timeFormat(time, maxTime){
let time1=time.split(":");
let time2=maxTime.split(":");
let min= time1[0];
let sec= time1[1];
let maxMin= time2[0];
let maxSec= time2[1];
let newTime=[];
console.log(time1);
newTime.push(maxMin-min);
newTime.push(maxSec-sec);
if (newTime[1]<0){
    newTime[0] -= 1;
    newTime[1]=60+newTime[1];
    // newTime[1] will be negative
    return newTime;
}
else {
    return newTime;
}


}
// input as seconds 
function format(time){
let min=0;
let sec=0;

    while(time>0){
        if (time>60){
            time-=60;
            min++;
            
        }
else{
    sec=time;
   time=0;
}
}

let newTime=[min,sec].join(":");

    return newTime;
}


console.log(console.log(format(2222)));

///d3 3 phase enter update remove

function setChart(){
    
let formatTime= d3.timeFormat("%M:%S");
let parseTime= d3.timeParse("%M:%S")
let rankMax=  d3.max(dataset,function(d){
    
    return d.Place;
});
let rankMin=d3.min(dataset,function(d){
    return  d.Place;
});
let timeMax=  d3.max(dataset, function(d){
   
    return d.Seconds;
});
let timeMin=   d3.min(dataset, function(d){
    return d.Seconds;
});  


let chart= d3.select("#chart")
.append("svg")
.attrs({
    "width": width,
    "height": height
});
let xscale= d3.scaleLinear();

xscale.domain([timeMax-timeMax,timeMax-timeMin]);
// can't use time format without converting to date...
// since I cannot use date, 

xscale.range([0,width-(padding*2)]);
xscale.tickFormat(format);

let yscale= d3.scaleLinear();
yscale.domain([rankMin,rankMax]);
yscale.range([0,height-(padding*2)]);


console.log(xscale.domain());



chart.append("text").text("Doping In Professional Cycling")
.attrs({
    "class": "title",
    "x": (width/2),
    "y": padding/2,
    "text-anchor": "middle"
});
chart.append("text").text("35 fastest times up Alpe d'Huez")
.attrs({
    "class": "subtitle",
    "x": (width/2),
    "y": padding/1.5,
    "text-anchor": "middle"
});


// if I map name data and store unique names in a list[] can create color chart for names.
chart.selectAll("circle")
.data(dataset)
.enter()
.append("circle")
.attrs({
 "cx": function(d){
    return xscale(timeMax-d.Seconds)+ padding;
},
 "cy": function(d){
     return yscale(d.Place)+padding;
 },
 "r": function(d){
    
     return d.Seconds/300;
 },
 "fill": function(d){
     let colorIndex= randomColor[0].indexOf(d.Name);
     return randomColor[1][colorIndex];
 },

});

chart .selectAll("circle")
.on("mouseenter",function(d){

    let x= d3.mouse(this)[0];
    let y= d3.mouse(this)[1];
    if(!document.getElementById("tooltip")){
        console.log(d.Name);
   document.getElementById("data").innerHTML="<h3 id='description'>Name: " +d.Name+"<br /> Nationality: "+ d.Nationality+"<br />Year: "+ d.Year +"<br /> Time: "+d.Time+"<br />Allegations: "+ d.Doping;"</h3>"
    chart.append("text")
   .html(d.Name)
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
      d3.select("#description").remove(); 
    }
   
});
xscale.range([width-(padding*2),0]);
yscale.range([height-padding,padding]);
let xAxis=d3.axisBottom(xscale).tickSizeInner([10]);
let yAxis=d3.axisLeft(yscale).tickSizeInner([10]);


chart.append("text").text("Place")
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

chart.append("text").text("Minutes Behind Fastest Time")
.attr("text-anchor","middle")
.attr("transform","translate("+width/2+","+padding*4.5+")")
.attr("class","label");


d3.selectAll(".xaxis")
.selectAll(".tick>text")
.text(function(d){
    console.log(format(d));
    return format(d)
});


}
