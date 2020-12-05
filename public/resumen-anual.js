function transformData(data) {
    let votosMateria = {};
    data.forEach(respuesta => {
        respuesta.materias.forEach(function(materia) {
            if (votosMateria[materia]) votosMateria[materia]++;
            else votosMateria[materia] = 1;
        });
    });
    // Paso de diccionario a objeto
    return Object.entries(votosMateria)
        .map(function(entrie) {
            return {
                materia: entrie[0],
                votos: entrie[1]
            }
        })
        // Ordeno de descendentemente por votos
        .sort((d1, d2) => d2.votos - d1.votos );
}

function graficarVotosPorMateria(svg, data) {
      data = transformData(data);
      console.log(
      data.map(d=>`${d.materia}: ${d.votos} votos\n`).reduce((acc,d) => acc+d)
      )
      let maxVotos = data[0].votos;
      // Redondeo al proximo multiplo de 10
      let cotaVotos = Math.ceil(maxVotos/10) * 10;
      // Add X axis
      var xScale = d3.scaleLinear()
        .domain([0, cotaVotos])
        .range([ 0, width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

      // Y axis
      var yScale = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.materia; }))
        .padding(.1);
      svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        // Mostrar en dos filas las materias con '/'
        // porque sino tienen nombres muy largos
        .filter(t => t.includes("/"))
        .each(function() {
            const self = d3.select(this);
            const s = self.text().split('/');  // get the text and split it
            console.log(s);
            self.text(''); // clear it out
            self.append("tspan") // insert two tspans
                .attr("y","-4px")
                .text(s[0]);
            self.append("tspan")
                .attr("x", -10)
                .attr("y","10px")
                .text(s[1]);
        });
      
      svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom()
            .scale(xScale)
            .tickSize(-height, 0, 0)
            .tickFormat(''));

      //Bars
      let barGroup = svg.selectAll()
        .data(data)
        .enter()
        .append("g");

      barGroup.append("rect")
        .attr('class', 'bar')
        .attr("x", xScale(0))
        .attr("y", (d) => yScale(d.materia))
        .attr("width", (d) => xScale(d.votos))
        .attr("height", yScale.bandwidth() )
        .attr("fill", "#69b3a2")
        .on('mouseenter', function (actual, i) {
          d3.select(this)
            .attr('opacity', 0.8)
          barGroup
            .append('text')
            .attr('class', 'label')
            .attr('x', xScale(actual.votos) + 10)
            .attr('y', yScale(actual.materia) + yScale.bandwidth())
            .text(actual.votos)
            .attr("fill", "#333");
        })
        .on('mouseleave', function (actual, i) {
          d3.select(this).attr('opacity', 1)
          barGroup.selectAll('.label').remove()
        });
}

function crearSVGEnDiv(divSelector) {
    // append the svg object to the body of the page
    let svg = d3.select(divSelector)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    return svg;
}
