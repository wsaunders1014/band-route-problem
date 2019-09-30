import {geneticAlgorithmConstructor} from '../../node_modules/geneticalgorithm/index.js';

const calcDistance = (x1,x2,y1,y2) => {
	return Math.hypot((x2-x1),(y2-y1));
}
//Randomly swaps indexes in tour to provide a "genetic mutation", thus changing possible fitness.
export const mutator = (tour) =>{
	var city1_index = Math.floor(Math.random() * tour.length )
    var city2_index = Math.floor(Math.random() * tour.length )
    if(city1_index === 0)
    	city1_index = 1;
    if(city2_index === 0)
    	city2_index = 1;
    var temp = tour[city1_index]
    tour[city1_index] = tour[city2_index]
    tour[city2_index] = temp
    
    return tour
}
function helper_concat(index,tourA,tourB) {
    return tourA.slice(0,index).concat( tourB.slice(index) ).concat( tourA.slice(index) )
}

 function helper_removeDuplicates(tour) {
    var duplicates = {}
    return tour.filter( function( item ) { 
        if ( duplicates[JSON.stringify(item)] ) { return false }
        else { duplicates[JSON.stringify(item)] = true ; return true }
    })
}

//Takes random indexes from each tour and swaps them, making sure there are no duplicates.
export const crossover =(tourA, tourB)=>{
	 var index = Math.round( Math.random() * tourA.length )
	 if(index == 0 || tourA.length-1){
	 	index == tourA.length/2;
	 }
    let tourX = helper_removeDuplicates( helper_concat(index,tourA,tourB) )
    let tourY = helper_removeDuplicates( helper_concat(index,tourB,tourA) )

    // move, copy, or append some values from a to b and from b to a
    return [ tourX , tourY ]
}
export const getFitness = (array)=>{
	//Accumulates distances between every stop and adds them together. The less the number the better.
	let fitness = 0;
	fitness = array.reduce((total,currVal,index)=>{
					
		if(index !== array.length-1){
			let nextPoint = array[index+1];
			return total += calcDistance(currVal.x,nextPoint.x,currVal.y,nextPoint.y);
			
		}
		return total;
	},0);
	//console.log('fitness: ',fitness);
	return fitness;
}
//Compares fitness score to see which is better.
export const compareFitness = (tourA, tourB) =>{
	  return getFitness(tourA) < getFitness(tourB);
}
export const gaConstructor = geneticAlgorithmConstructor;


