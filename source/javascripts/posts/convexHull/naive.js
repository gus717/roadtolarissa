var margin = {top: 10, right: 10, bottom: 10, left: 10},
		width = 750 - margin.left - margin.right
		height = 500 - margin.top - margin.bottom

var numPoints = 20,
		points = d3.range(numPoints).map(function(i){
			return {x: Math.random()*width, y: Math.random()*height, i: i}
		})

var svg = d3.select('#naive')
	.append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var pairLineG = svg.append('g')

svg.append('defs').append('marker')
		.attr({id: 'head', orient: 'auto', markerWidth: 2, markerHeight: 4, refX: .1, refY: 2})
	.append('path')
		.attr({d: 'M0,0 V4 L2,2 Z', fill: 'red'})

svg.append('path')
		.classed('pairLine', true)
		.attr('marker-end', 'url(#head)')
circles = svg.selectAll('circle')
		.data(points).enter()
	.append('circle').classed('point', true)
		.attr('r', 5)
		.attr('cx', f('x'))
		.attr('cy', f('y'))
		.each(function(d){ d.circle = d3.select(this) })



var pairNums = []
d3.range(numPoints).forEach(function(i){
	d3.range(numPoints).forEach(function(j){
		if (i === j) return 
		pairNums.push({i: i, j: j})
	})
})

var currentPair = 0;
function iteratePair(){
	drawPairLine(pairNums[currentPair])
	currentPair++
	if (currentPair == pairNums.length) return
	window.setTimeout(iteratePair, 100)
}
iteratePair()

function drawPairLine(pair){
	var a = points[pair.i]
	var b = points[pair.j]
	
	var otherCircles = circles
			.classed('left', false)
			.classed('right', false)
			.attr('r', 5)
			.filter(function(d, i){ return i != a.i && i != b.i })

	a .circle.attr('r', 10).classed('left',  true)
	b.circle.attr('r', 10).classed('right', true)
	d3.select('.pairLine')
			.attr('d', ['M', a.x, ',', a.y, ' L', b.x, ',', b.y].join(''))

	var m = (a.y - b.y)/(a.x - b.x)
	var B = a.y - m*a.x
	var dir = a.x  > b.x 

	var allLeft = true
	otherCircles.style('fill', function(d){
		var isLeft = dir ^ (d.x*m + B > d.y)
		allLeft = allLeft && isLeft
		return isLeft ? 'yellow' : 'blue'
	})
	if (allLeft){
		pairLineG.append('path')
				.classed('convex', true)
				.attr('marker-end', 'url(#head)')
				.attr('d', ['M', a.x, ',', a.y, ' L', b.x, ',', b.y].join(''))
	}

}