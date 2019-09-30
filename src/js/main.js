import {points40,points200,points500} from './data.js';

import * as ga from './ga.js';
//initialize empty pop array
var pop = [];

console.log(ga);
var generatedRoute = false;
//The amount of times to evolve our genetic algorithm. Arbitrary number, could make it configurable down the line or more specific.
const evolveLimit = 2000;
//Making canvas a global element for ease of access in several functions.
var canvas = document.getElementById('canvas');
//This is just a semantic abstraction, it feels more readable than just using Math.hypot.
const calcDistance = (x1,x2,y1,y2) => {
	return Math.hypot((x2-x1),(y2-y1));
}

//A shuffle algorithm stolen from Stack Overflow, https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/2450976#2450976
function shuffleArray(array) {
    for (let i = 1; i < array.length-1; i++) {
        const j = Math.ceil(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}
//A population is a collection of "tours" that have been randomized. Using the shuffle function I will create a number of individuals from the original dataset.
 const createPop = (dataset,iterations = 20) =>{
 	let pop = [];
	for(let i = 0;i<iterations;i++){
		//don't want to alter the original dataset so making a copy.
		let tempArray = dataset.slice(0);
		
		shuffleArray(tempArray);

		//console.log(tempArray)
		//adding the start point to the end of the array since this is a roundtrip route.
		tempArray.push(tempArray[0])
		pop.push(tempArray);
	}
	return pop;
	console.log('pop length:', pop.length);
}

//Displays info in Table.
const displayRouteTable = (dataset) =>{
	let route = dataset;
	for(let i = 0; i<route.length; i++){
		let table = document.getElementById('routeData');
		let row = table.insertRow(-1);
		//there are 4 cells;
		let cell0 = row.insertCell(0);
		let cell1 = row.insertCell(1);
		//let cell2 = row.insertCell(2);
		//let cell3 = row.insertCell(3);
		cell0.innerHTML = `${i+1}`;
		cell1.innerHTML = `${route[i].x}, ${route[i].y}`;
		//cell2.innerHTML = `${route[i].distance}`;
		//cell3.innerHTML = `${route[i].index}`;
	}
}



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

	ctx.font = '10px Arial';
	for(let i = 0;i<dataset.length;i++){
		 ctx.beginPath();
		 //Create dots for cities
		 ctx.arc(dataset[i].x,dataset[i].y,10,0,2*Math.PI);
		 //Make start point red to differentiate it
		 (i!==0) ? ctx.fillStyle="blue": ctx.fillStyle="red";
		 ctx.fill();
		 ctx.closePath();

		 //Label dots with number of stop.
		 ctx.fillStyle = '#fff';
		 if(i<10)
		 	ctx.fillText(i+1,dataset[i].x-3,dataset[i].y+3);
		 else if(i<100 && i>=10)
		 	ctx.fillText(i+1,dataset[i].x-5,dataset[i].y+3);
		 else
		 	ctx.fillText(i+1,dataset[i].x-8,dataset[i].y+3);
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
//Doesn't work at the moment.
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
				//generatedRoute = calcRoute(points40);
				document.getElementById('loader').style.display = 'block';
				pop = createPop(points40);
				var config = {
				    mutationFunction: ga.mutator,
				    crossoverFunction: ga.crossover,
				    fitnessFunction: ga.getFitness,
				    doesABeatBFunction: ga.compareFitness,
				    population: pop
				    //populationSize: aDecimalNumberGreaterThanZero 	// defaults to 100
				}
				console.log(pop.length)
				//Evolves the population 20 times, the more it's evolved the more optimal the response will be.
				var geneticalgorithm = ga.gaConstructor(config);
				for(let i =0;i<evolveLimit;i++){
					geneticalgorithm.evolve();
				}
				console.log(geneticalgorithm.best(),geneticalgorithm.bestScore());
				document.getElementById('loader').style.display = 'none';
				displayRouteTable(geneticalgorithm.best());
				displayPoints(geneticalgorithm.best());
				document.getElementById('distance').innerHTML = `Distance is ${geneticalgorithm.bestScore()}` 
				break;
			case 'points200':
				pop = createPop(points200);
				var config = {
				    mutationFunction: ga.mutator,
				    crossoverFunction: ga.crossover,
				    fitnessFunction: ga.getFitness,
				    doesABeatBFunction: ga.compareFitness,
				    population: pop
				    //populationSize: aDecimalNumberGreaterThanZero 	// defaults to 100
				}
				console.log(pop.length)
				//Evolves the population 20 times, the more it's evolved the more optimal the response will be.
				var geneticalgorithm = ga.gaConstructor(config);
				for(let i =0;i<evolveLimit;i++){
					geneticalgorithm.evolve();
				}
				console.log(geneticalgorithm.best(),geneticalgorithm.bestScore());
				document.getElementById('loader').style.display = 'none';
				displayRouteTable(geneticalgorithm.best());
				displayPoints(geneticalgorithm.best());
				document.getElementById('distance').innerHTML = `Distance is ${geneticalgorithm.bestScore()}` 
				break;
			case 'points500':
				pop = createPop(points500);
				var config = {
				    mutationFunction: ga.mutator,
				    crossoverFunction: ga.crossover,
				    fitnessFunction: ga.getFitness,
				    doesABeatBFunction: ga.compareFitness,
				    population: pop
				    //populationSize: aDecimalNumberGreaterThanZero 	// defaults to 100
				}
				console.log(pop.length)
				//Evolves the population 20 times, the more it's evolved the more optimal the response will be.
				var geneticalgorithm = ga.gaConstructor(config);
				for(let i =0;i<evolveLimit;i++){
					geneticalgorithm.evolve();
				}
				console.log(geneticalgorithm.best(),geneticalgorithm.bestScore());
				document.getElementById('loader').style.display = 'none';
				displayRouteTable(geneticalgorithm.best());
				displayPoints(geneticalgorithm.best());
				document.getElementById('distance').innerHTML = `Distance is ${geneticalgorithm.bestScore()}` 

			default:
				
			break;

		}
		
		//displayPoints(generatedRoute);
		//displayRouteTable(generatedRoute);

	});
}


/*Deprecated. Was used to find the shortest route one way.
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
	
	
//Creates table of data and displays it.
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

}*/