import * as d3 from 'd3'
import * as topojson from 'topojson'

import d3Annotation from 'd3-svg-annotation'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 45, left: 20, right: 20, bottom: 20 }

const height = 600 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-9')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3.scaleSequential(d3.interpolateBrBG)

const projection = d3
  .geoTransverseMercator()
  .rotate([76 + 35 / 60, -40])
  .translate([width / 2], height / 2)

// out geoPath needs a PROJECTION variable
const path = d3.geoPath().projection(projection)

Promise.all([
  d3.json(require('/data/zipcodes.json')),
  d3.csv(require('/data/incident_codes.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  console.log(json)
  const states = topojson.feature(json, json.objects.zipcodes)
  console.log(states)

  const ratsExtent = d3.extent(datapoints.map(d => +d.Unique))
  colorScale.domain(ratsExtent.reverse())

  const radiusScale = d3
    .scaleSqrt()
    .domain([0, 4000])
    .range([3, 15])

  // Not sure how to do scale/centeßr/etc?
  // Just use .fitSize to center your map
  // and set everything up nice
  projection.fitSize([width, height], states)

  // call tips

  const tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return `<span style='color:red'>${d.Unique}</span>`
    })

  svg
    .selectAll('.state')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    .attr('fill', 'grey')
    .attr('stroke', 'black')

  svg
    .selectAll('.state')
    .data(datapoints)
    .attr('class', 'state')
    .attr('fill', function(d) {
      return colorScale(d.Unique)
    })
  //   .on('mouseover', tip.show)
  //   .on('mouseout', tip.hide)

  // svg.call(tip)

  // svg
  //   .selectAll('.Incident-Zip')
  //   .data(datapoints)
  //   .enter()
  //   .append('circle')
  //   .attr('r', function(d) {
  //     return radiusScale(d.Unique)
  //   })
  //   .attr('transform', function(d) {
  //     const coords = projection([d.Longitude, d.Latitude])
  //     return `translate(${coords})`
  //   })
  //   .attr('fill', function(d) {
  //     return colorScale(+d.Unique)
  //   })
  //   .attr('opacity', 0.8)
  //   .on('mouseover', tip.show)
  //   .on('mouseout', tip.hide)

  // svg.call(tip)

  svg
    .append('text')
    .attr('font-size', '18')
    .attr('text-anchor', 'middle')
    .text('N.Y Rat Sight Complaints Per Zip Code')
    .attr('x', width / 2)
    .attr('dy', -30)
    .attr('dx', 0)
    .attr('font-weight', 'bold')

  d3.select('#blank').on('stepin', function() {
    // svg
    //   .selectAll('.state')
    //   .data(states.features)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'state')
    //   .attr('d', path)
    //   .attr('fill', 'grey')
    //   .attr('stroke', 'black')
    svg
      .selectAll('.state')
      // .data(datapoints)
      .attr('class', 'state')
      .attr('fill', 'grey')
  })
  d3.select('#second-step').on('stepin', () => {
    // svg
    //   .selectAll('.state')
    //   .data(states.features)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'state')
    //   .attr('d', path)
    //   .attr('fill', 'grey')
    //   .attr('stroke', 'black')
    svg
      .selectAll('.state')
      // .data(datapoints)
      .attr('class', 'state')
      .attr('fill', function(d) {
        if (d.Unique < 100) {
          return colorScale(d.Unique)
        } else {
          return 'grey'
        }
      })
      .raise()
  })

  d3.select('#third-step').on('stepin', () => {
    // svg
    //   .selectAll('.state')
    //   .data(states.features)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'state')
    //   .attr('d', path)
    //   .attr('fill', 'grey')
    //   .attr('stroke', 'black')
    svg
      .selectAll('.state')
      // .data(datapoints)
      .attr('class', 'state')
      .attr('fill', function(d) {
        if (d.Unique < 1000) {
          return colorScale(d.Unique)
        } else {
          return 'grey'
        }
      })
      .raise()
  })
  d3.select('#forth-step').on('stepin', () => {
    // svg
    //   .selectAll('.state')
    //   .data(states.features)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'state')
    //   .attr('d', path)
    //   .attr('fill', 'grey')
    //   .attr('stroke', 'black')
    svg
      .selectAll('.state')
      // .data(datapoints)
      .attr('class', 'state')
      .attr('fill', function(d) {
        if (d.Unique < 2000) {
          return colorScale(d.Unique)
        } else {
          return 'grey'
        }
      })
      .raise()
  })
  d3.select('#fifth-step').on('stepin', () => {
    // svg
    //   .selectAll('.state')
    //   .data(states.features)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'state')
    //   .attr('d', path)
    //   .attr('fill', 'grey')
    //   .attr('stroke', 'black')
    svg
      .selectAll('.state')
      // .data(datapoints)
      .attr('class', 'state')
      .attr('fill', function(d) {
        if (d.Unique > 3000 && d.Unique < 4000) {
          return colorScale(d.Unique)
        } else {
          return 'grey'
        }
      })
      .raise()
  })

  d3.select('#sixth-step').on('stepin', () => {
    // svg
    //   .selectAll('.state')
    //   .data(states.features)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'state')
    //   .attr('d', path)
    //   .attr('fill', 'grey')
    //   .attr('stroke', 'black')
    svg
      .selectAll('.state')
      // .data(datapoints)
      .attr('class', 'state')
      .attr('fill', function(d) {
        if (d.Unique > 4000) {
          return colorScale(d.Unique)
        } else {
          return 'grey'
        }
      })
    // .raise()
  })
  d3.select('#reset-step').on('stepin', function() {
    // console.log('hello')
    // svg
    //   .selectAll('.state')
    //   .data(states.features)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'state')
    //   .attr('d', path)
    //   .attr('fill', 'grey')
    //   .attr('stroke', 'black')
    svg
      .selectAll('.state')
      // .data(datapoints)
      // .attr('class', 'state')
      .attr('fill', function(d) {
        return colorScale(d.Unique)
      })
    // .raise()
  })
}
