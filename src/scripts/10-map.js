import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 10, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 400 - margin.left - margin.right

const container = d3.select('#chart-10')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([2010, 2019])
  .range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 8000])
  .range([height, 0])

const line = d3
  .line()
  .x(d => xPositionScale(d.Date))
  .y(d => yPositionScale(d.Unique))

d3.csv(require('/data/Borough_year.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // svg
  //   .append('text')
  //   .attr('font-size', '18')
  //   .attr('text-anchor', 'middle')
  //   .text('Complaints Peaked in 2017 in All Boroughs, Except Staten Island')
  //   .attr('x', width / 2)
  //   .attr('y', margin.top / 2)

  // container
  //   .selectAll('svg')
  //   .enter()
  //   .append('svg')
  //   .attr('height', 100)
  //   .attr('width', width + margin.left + margin.right)
  //   .append('text')
  //   .attr('font-size', '18')
  //   .attr('text-anchor', 'middle')
  //   .text('Complaints Peaked in 2017 in All Boroughs, Except Staten Island')
  //   .attr('x', width / 2)
  //   .attr('y', margin.top / 2)

  const nested = d3
    .nest()
    .key(d => d.Borough)
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const svg = d3.select(this)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('stroke', '#7fbf7b')
        .attr('fill', 'none')
        .attr('stroke-width', 2)

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#7fbf7b')
        .attr('y', -15)
        .attr('font-weight', 'bold')
        .attr('font-size', 14)

      // container
      //   .append('text')
      //   .attr('font-size', '18')
      //   .attr('text-anchor', 'middle')
      //   .text('Complaints Peaked in 2017 in All Boroughs, Except Staten Island')
      //   .attr('x', width / 2)
      //   .attr('dy', 0)
      //   .attr('dx', 0)

      const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      const yAxis = d3
        .axisLeft(yPositionScale)
        .tickValues([2000, 4000, 6000, 8000])
        .tickSize(-width)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      svg.selectAll('.y-axis path').remove()
      svg
        .selectAll('.y-axis line')
        .attr('stroke-dasharray', 2)
        .attr('stroke', 'grey')
    })
}
