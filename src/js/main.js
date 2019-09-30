import {points40,points200,points500} from './data.js';


var generatedRoute = false;
//This is just a semantic abstraction, it feels more readable than just using Math.hypot.
const calcDistance = (x1,x2,y1,y2) => {
	return Math.hypot((x2-x1),(y2-y1));
}

//Returns index of next closest point from the last point.
const findClosestPoint = (lastPoint,pointsLeft) =>{
	//console.log(lastPoint);
	let closestPoint = pointsLeft.reduce((closest,currVal,index)=>{
		let calcD = calcDistance(lastPoint.x,currVal.x,lastPoint.y,currVal.y);
		//console.log(index,calcD);
		//initialize distance
		if(closest.distance == null){
			closest = {distance:calcD,index:index};
		}
		if(calcD < closest.distance){
			closest = {distance:calcD,index:index,coords:{x:currVal.x,y:currVal.y}};
		}
		return closest;
	},{distance:null,index:null,coords:{}});
	//console.log('cp: ',closestPoint);
	return closestPoint;
	

};
	
const calcRoute = (dataset) => {
		console.log('test');
	//Going to clone the dataset so I'm not making changes to it directly.
	let pointsLeft = dataset.slice(0);
	//Starting coords are the first set, so I'm going to remove them and add them to a new array.
	let route = [pointsLeft.shift()];
	route[0].distance = 0;
	route[0].index = 0;
	
	//Have to store this now, or else the for loop doesn't work correctly.
	const tourLength = pointsLeft.length; //39

	

	//Iterates through the pointsLeft array, removing the closest next point and adding it to route array. 
	for(let i=0; i<tourLength; i++){
		//Returns object with index and distance
		let nextPoint = findClosestPoint(route[route.length-1],pointsLeft);
		//console.log('np; ',nextPoint)
		let pointObj = pointsLeft.splice(nextPoint.index,1)[0];
		route.push({x:pointObj.x,y:pointObj.y,distance:nextPoint.distance,index:nextPoint.index});

		
	}
	//console.log('route:', route);
	return route;

}
//Creates table of data
const displayRouteTable = (dataset) =>{
	let route = dataset;
	for(let i = 0; i<route.length; i++){
		let table = document.getElementById('routeData');
		let row = table.insertRow(-1);
		//there are 4 cells;
		let cell0 = row.insertCell(0);
		let cell1 = row.insertCell(1);
		let cell2 = row.insertCell(2);
		//let cell3 = row.insertCell(3);
		cell0.innerHTML = `${i+1}`;
		cell1.innerHTML = `${route[i].x}, ${route[i].y}`;
		cell2.innerHTML = `${route[i].distance}`;
		//cell3.innerHTML = `${route[i].index}`;
	}
}
//console.log(points40);
var canvas = document.getElementById('canvas');

//Creates dots for cities and line for route on Canvas
const displayPoints = (dataset) =>{
	let ctx = canvas.getContext('2d');
	//clear canvas in case other data is on it.
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//turn every value into a percentage of a 1000, then use that percentage to find the new value against the smaller window. Works on page load, but not on resize
	if(window.innerWidth<1000){
		dataset.map((currVal,index)=>{
			
			let xPercent = currVal.x/1000;
			let yPercent = currVal.y/1000;
			dataset[index].x = window.innerWidth * xPercent;
			dataset[index].y = window.innerWidth * yPercent;
		})
	}
	
	
 	ctx.beginPath();
 	ctx.moveTo(dataset[0].x,dataset[0].y);
	for(let i = 1;i<dataset.length;i++){
		ctx.lineTo(dataset[i].x,dataset[i].y);
		
	}
	ctx.lineTo(dataset[0].x,dataset[0].y);
	ctx.stroke();

	ctx.closePath();
	ctx.beginPath();
	for(let i = 0;i<dataset.length;i++){
		
		 ctx.arc(dataset[i].x,dataset[i].y,10,0,2*Math.PI);
		 ctx.fillStyle="blue";
		 ctx.fill();
		 ctx.closePath();
	}
}

//Making canvas responsive.
window.addEventListener('DOMContentLoaded', ()=>{
	if(window.innerWidth<1000){
		canvas.setAttribute('width',window.innerWidth-20);
		canvas.setAttribute('height',window.innerWidth-20);
	}
	//generatedRoute = calcRoute(points40);
	//displayPoints(generatedRoute);
})
window.addEventListener('resize', ()=>{
	
	if(generatedRoute !== false && window.innerWidth < 1000){
		
		canvas.setAttribute('width',window.innerWidth-20);
		canvas.setAttribute('height',window.innerWidth-20);
		setTimeout(()=>{displayPoints(generatedRoute)},50);
	}else{
		canvas.setAttribute('width',1000);
		canvas.setAttribute('height',1000);
		//displayPoints(generatedRoute);
	}
})

//BUTTON EVENTS
var buttons= document.getElementsByTagName('button');
for(let i=0;i<buttons.length;i++){
	buttons[i].addEventListener('click', (e)=>{
		
		switch(e.target.getAttribute('id')){
			case 'points40':
				generatedRoute = calcRoute(points40);
				break;
			case 'points200':
				generatedRoute = calcRoute(points200);
				break;
			case 'points500':
				generatedRoute = calcRoute(points500);
			default:
			break;

		}
		
		displayPoints(generatedRoute);
		displayRouteTable(generatedRoute);
	});
}

//displayRouteTable(points40);
//console.log(calcRoute(points40));


// class City{
// 	constructor(x,y){
// 		this.x = x;
// 		this.y = y;
// 	}
// 	getCoords = () =>{
// 		return {x:this.x,y:this.y}
// 	}
// 	getDistance = (city1, city2)=>{
// 		let city1Coords = city1.getCoords();
// 		let city2Coords = city2.getCoords();
// 		return Math.hypot(city2Coords.x-city1Coords.x,city2Coords.y-city1Coords.y);
// 	}
// }
// class TourManager {
// 	constructor(){
// 		let remainingCities = points40.slice(0);
// 		let originCity = remainingCities.shift();
// 	}
// 	getCity = (index) =>{
// 			return remainingCities[index];
// 	}
// 	numberOfCities = () =>{
// 		return remainingCities.length;
// 	}

// }
// class Tour{
// 	constructor(){
// 		this.list = [];
// 		this.fitness = 0;
// 		this.distance = 0;
// 	}

// }