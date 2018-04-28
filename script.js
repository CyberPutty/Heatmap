
let dataset2=[[20,45],[30,70],[100,50],[150,30],[70,35],[280,180],[15,30],[20,95]]
let dataset;
let padding= 200;
let width= 1500;
let height= 800+ padding;

// cylclist data
document.addEventListener('DOMContentLoaded', function(){
    fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        dataset= data;
        

        setChart();
    })
    
}
    
);


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
    "x": (width/2-(padding*2)),
    "y": padding
});



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
    
     return d.Seconds/200;
 },
 "fill": "teal",

});

chart .selectAll("rect")
.on("mouseenter",function(d){

    let x= d3.mouse(this)[0];
    let y= d3.mouse(this)[1];
    if(!document.getElementById("tooltip")){
   
    chart.append("text")
   .html("text")
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
yscale.range([height-padding,padding]);
let xAxis=d3.axisBottom(xscale).tickSizeInner([10]);
let yAxis=d3.axisLeft(yscale).tickSizeInner([10]);

chart.append("g")
.attr("class","yaxis")
.attr("transform","translate("+padding+",0)")
.call(yAxis);

chart.append("g")
.attr("class","xaxis")
.attr("transform","translate("+padding+","+(height-padding)+")")
.call(xAxis);

chart.append("text").text("description")
.attr("transform","translate("+width/10+","+padding*5.5+")");


d3.selectAll(".xaxis")
.selectAll(".tick>text")
.text(function(d){
    console.log(format(d));
    return format(d)
});


}
