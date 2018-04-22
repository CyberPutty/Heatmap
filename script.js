let dataset=[20,45,78,100,15];
let dataset2=[[20,45],[30,70],[100,50],[150,30],[70,35],[280,180],[15,30],[20,95]]

let padding= 30;
let width= 600+ padding;
let height= 600+ padding;
let chart= d3.select("#chart")
.append("svg")
.attrs({
    "width": width,
    "height": height
});
let xscale= d3.scaleLinear();
xscale.domain([0,d3.max(dataset, function(d){
    return d;
})]);
xscale.range([0,height-(padding*2)]);

let yscale= d3.scaleLinear();

yscale.domain([0,d3.max(dataset, function(d){
    return d;
})]);
yscale.range([height-padding,padding]);

///d3 3 phase enter update remove
let xAxis=d3.axisBottom(xscale).tickSize([0]).ticks(0);
let yAxis=d3.axisLeft(yscale);

chart.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attrs({
 "width": function(){
     return (width/dataset.length)-(padding *2);
 },
 "height": function(d){
     return xscale(d);
 },
 "x": function(d,i){
     return (width/dataset.length)*i+ padding;
 },
 "y": function(d){
     return (height-xscale(d))- padding;
 },
 "fill": "teal",

});

chart .selectAll("rect")
.on("mouseenter",function(d){
    console.log(d);
    let x= d3.mouse(this)[0];
    let y= d3.mouse(this)[1];
    if(!document.getElementById("tooltip")){
  
    chart.append("text")
   .text(d)
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
chart.append("g")
.attr("class","yaxis")
.attr("transform","translate("+padding+",0)")
.call(yAxis);

chart.append("g")
.attr("class","xaxis")
.attr("transform","translate("+padding+","+(height-padding)+")")
.call(xAxis);

