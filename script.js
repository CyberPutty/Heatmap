let dataset=[20,45,78,100,15];
let dataset2=[[20,45],[30,70],[100,50],[150,30],[70,35],[280,180],[15,30],[20,95]]
let grossData;
let description;
let padding= 200;
let width= 1500;
let height= 800+ padding;


document.addEventListener('DOMContentLoaded', function(){
    fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        grossData= data.data;
        description= data.description;
        

        setChart();
    })
    
}
    
);

///d3 3 phase enter update remove

function setChart(){
    

let dateMax= new Date( d3.max(grossData,function(d){
    return d[0];
}));
let dateMin= new Date( d3.min(grossData,function(d){
    return d[0];
}));
let valueMax= d3.max(grossData, function(d){
    return d[1];
});
let valueMin= d3.min(grossData, function(d){
    return d[1];
});  

console.log(dateMax);
let chart= d3.select("#chart")
.append("svg")
.attrs({
    "width": width,
    "height": height
});
let xscale= d3.scaleTime();
xscale.domain([dateMin,dateMax]);

xscale.range([0,width-(padding*2)]);

let yscale= d3.scaleLinear();
yscale.domain([valueMin,valueMax]);
yscale.range([0,height-(padding*2)]);


console.log(yscale.domain());
let formatTime= d3.timeFormat("%B,%Y");


chart.append("text").text("US Gross Domestic Product- Quarterly")
.attrs({
    "class": "title",
    "x": (width/2-(padding*2)),
    "y": padding
});


console.log(grossData);
chart.selectAll("rect")
.data(grossData)
.enter()
.append("rect")
.attrs({
 "width": function(){
     console.log(grossData.length);
     return ((width-(padding * 2))/grossData.length);
 },
 "height": function(d){
     
     return yscale(d[1]);
 },
 "x": function(d,i){
     return ((width-padding *2)/grossData.length)*i+ padding;
 },
 "y": function(d){
     
     return (height-yscale(d[1]))- padding;
 },
 "fill": "teal",

});

chart .selectAll("rect")
.on("mouseenter",function(d){

    let x= d3.mouse(this)[0];
    let y= d3.mouse(this)[1];
    if(!document.getElementById("tooltip")){
   
    chart.append("text")
   .html(d[1]+" Billion <tspan id='newline' x="+x+" y="+(y+20)+" >"+formatTime(new Date(d[0]))+"</tspan>")
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
.attr("class","axis")
.attr("transform","translate("+padding+",0)")
.call(yAxis);

chart.append("g")
.attr("class","axis")
.attr("transform","translate("+padding+","+(height-padding)+")")
.call(xAxis);

chart.append("text").text(description)
.attr("transform","translate("+width/10+","+padding*5.5+")");
}
