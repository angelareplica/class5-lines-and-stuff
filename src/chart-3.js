import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Normal scales
const xPositionScale = d3
  .scaleLinear()
  .domain([1, 25])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 50])
  .range([height, 0])

// Create line function
const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.day)
  })
  .y(d => {
    return yPositionScale(d.temperature)
  })

// Read in data with multiple countries
d3.csv(require('./data-multiline.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  console.log('Chart 3 data looks like', datapoints)

  // instead of grouping (df.groupby), it's called nesting in d3
  const nested = d3
    .nest() // key signifies what you're grouping by. in this case, it's the country column
    .key(d => {
      return d.country
    })
    .entries(datapoints)

  console.log('nested data looks like', nested)

  // Give this our GROUPED data, so it has TWO groups (which is TWO datapoints)
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('stroke', 'lightblue')
    .attr('stroke-width', 2)
    .attr('fill', 'none') // for different colors you can use a function and return a colorScale based on d.key
    .attr('d', d => {
      // console.log(d)
      return line(d.values)
    }) // 'd' means shape?

  /* Draw your lines */

  /* Add in your axes */
  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
