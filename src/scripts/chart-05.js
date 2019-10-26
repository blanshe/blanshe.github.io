import * as d3 from 'd3'
import d3Annotation from 'd3-svg-annotation'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 100, left: 30, right: 80, bottom: 30 }
const height = 500 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right
const padding = { top: 20, right: 20, bottom: 20, left: 20 }

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Normal scales
const xPositionScale = d3
  .scaleLinear()
  .domain([1992, 2018])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([-10, 160])
  .range([height, 0])

const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.year)
  })
  .y(d => {
    return yPositionScale(d.export)
  })

/*
  We want to read in:
  
    d3.csv(require('./data-singleline-cimbria.csv'))
  
  But we also want to read in:
  
    d3.csv(require('./data-singleline-cimmeria.csv'))
  
  How do we do both?
*/

/* This is a Promise */
Promise.all([
  d3.csv(require('../data/america.csv')),
  d3.csv(require('../data/china.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

/* 
First CSV file becomes datapointsCimbria
Second CSV file becomes datapointsCimmeria 
*/
function ready([datapointschina, datapointsamerica]) {
  console.log('china is', datapointschina)
  console.log('america is', datapointsamerica)

  const tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return `${d.year} <span style='color:red'>${d.export}</span>`
    })

  /* Draw one line for each country */
  svg
    .append('path')
    .datum(datapointschina)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#fdbb84')
    .attr('stroke-width', 2)

  svg
    .append('path')
    .datum(datapointsamerica)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#2ca25f')
    .attr('stroke-width', 2)

  /* Add in your temperature circles */
  svg
    .selectAll('.circle-cimmeria')
    .data(datapointschina)
    .enter()
    .append('circle')
    .attr('class', 'circle-cimmeria')
    .attr('r', 4)
    .attr('cx', d => {
      return xPositionScale(d.year)
    })
    .attr('cy', d => {
      return yPositionScale(d.export)
    })
    .attr('fill', '#fdbb84')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  svg.call(tip)

  svg
    .selectAll('.circle-cimbria')
    .data(datapointsamerica)
    .enter()
    .append('circle')
    .attr('class', 'circle-cimbria')
    .attr('r', 4)
    .attr('cx', d => {
      return xPositionScale(d.year)
    })
    .attr('cy', d => {
      return yPositionScale(d.export)
    })
    .attr('fill', '#2ca25f')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  svg.call(tip)

  svg
    .append('text')
    .attr('font-size', '30')
    .attr('text-anchor', 'middle')
    .text('China, US Exports to Africa')
    .attr('x', width / 2)
    .attr('y', -60)
    .attr('dx', -20)

  svg
    .append('text')
    .attr('font-size', '20')
    .attr('text-anchor', 'middle')
    .text('China')
    .attr('x', 730)
    .attr('y', 130)
    .attr('dx', -20)

  svg
    .append('text')
    .attr('font-size', '20')
    .attr('text-anchor', 'middle')
    .text('U.S.A')
    .attr('x', 730)
    .attr('y', 320)
    .attr('dx', -20)

  const annotations = [
    {
      note: {
        label: 'China earned $8.5 for every $1 US earned from Africa market',
        title: 'Big win'
      },
      data: { year: '2015', export: 155.7 },
      dx: -300,
      dy: 0,
      color: '#636363'
    }
  ]

  const makeAnnotations = d3Annotation
    .annotation()
    .accessors({
      x: d => xPositionScale(d.year),
      y: d => yPositionScale(d.export)
    })
    .annotations(annotations)

  svg.call(makeAnnotations)

  /* Add in your axes */

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([0, 20, 40, 60, 80, 100, 120, 140, 160])
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
}
