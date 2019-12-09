import * as d3 from 'd3'
import * as topojson from 'topojson'

import d3Annotation from 'd3-svg-annotation'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 80, left: 20, right: 20, bottom: 20 }

const height = 500 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// const colorScale = d3
//   .scaleOrdinal()
//   .range([['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']])

const colorScale = d3.scaleSequential(d3.interpolateCividis)

const projection = d3
  .geoTransverseMercator()
  .rotate([76 + 35 / 60, -40])
  .translate([width / 2], height / 2)

// out geoPath needs a PROJECTION variable
const path = d3.geoPath().projection(projection)

d3.json(require('/data/boroughs_incidents.json'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
  console.log(json)
  const states = topojson.feature(json, json.objects.boroughs_incidents)
  console.log(states)

  const ratsExtent = d3.extent(
    states.features.map(d => +d.properties.Incidents)
  )
  colorScale.domain(ratsExtent)

  // call tips
  const tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      // return `<span style='color:red'>${+d.properties.Incidents}</span>`
      return `${
        d.properties.boro_name
      } <span style='color:red'>${+d.properties.Incidents}</span>`
    })

  // Not sure how to do scale/centeßr/etc?
  // Just use .fitSize to center your map
  // and set everything up nice
  projection.fitSize([width, height], states)

  svg
    .selectAll('.state')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    .attr('fill', function(d) {
      return colorScale(+d.properties.Incidents)
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  svg.call(tip)

  svg
    .append('text')
    .attr('font-size', '18')
    .attr('text-anchor', 'middle')
    .text('N.Y Rat Sight Complaints Per Borough')
    .attr('x', width / 2)
    .attr('dy', -40)
    .attr('dx', 20)
    .attr('font-weight', 'bold')
}
