let dataset=[20,45,78,100,15];
let width= 600;
let height= 600;
let padding= 20;
let chart= d3.select("#chart")
.append("svg")
.attrs({
    "width": width,
    "height": height
});

///d3 3 phase enter update remove

chart.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attrs({
 "width": 50,
 "height": function(d){
     return d;
 },
 "x": function(d,i){
     return (50+padding)*i;
 },
 "y": function(d){
     return height-d;
 },
 "fill": "teal",

});

chart .selectAll("rect")
.on("mouseenter",function(){
    let x= d3.mouse(this)[0];
    let y= d3.mouse(this)[1];
    if(!document.getElementById("tooltip")){
    console.log('added');
    chart.append("text")
   .text("text")
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

  console.log(d3.mouse(this));
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
   
})

;

