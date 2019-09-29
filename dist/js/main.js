import {points40,points200,points500} from './data.js';

const calcDistance = (x1,x2,y1,y2) => {
	return Math.hypot((x2-x1),(y2-y1));
}

//Returns index of next closest point from the last point.
const findClosestPoint = (lastPoint,pointsLeft) =>{
	let closestPoint = pointsLeft.reduce((closest,currVal,index)=>{
		let distance = calcDistance(lastPoint.x,currVal.x,lastPoint.y,currVal.y);
		//console.log(index,distance);
		//initialize distance
		if(closest.distance === 0){
			closest = {distance:distance,index:index};
		}
		if(distance < closest.distance){
			closest = {distance:distance,index:index};
		}
		return closest;
	},{distance:0,index:null});
	//console.log('cp: ',closestPoint);
	return closestPoint.index;
	

};
	
const calcRoute = (dataset) => {

	//Going to clone the dataset so I'm not making changes to it directly.
	let pointsLeft = dataset.slice(0);
	//Since no start coords were given, I'm just going to use the first entry of the array.
	let route = [pointsLeft.shift()];
	console.log(pointsLeft);
	const tourLength = pointsLeft.length;

	//Iterates through the pointsleft, removing the closest next point and adding it to route. 
	for(let i = 0; i<tourLength;i++){
		route.push(pointsLeft.splice(findClosestPoint(route[route.length-1],pointsLeft),1)[0]);
		//console.log("route: ",route.length);
		//console.log("pointsLeft: ",pointsLeft.length);
	}
	//console.log("route: ",route.length);
	//console.log("pointsLeft: ",pointsLeft.length);

}
console.log(calcRoute(points40));