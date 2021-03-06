class croppedDetection {
    constructor() {
        this.img = new Image();
        this.img.src = "images.png"; // source da imagem/CAM
        this.attachCropBox();
    }

    attachCropBox() {
        const margin = { top: 0, right: 0, bottom: 0, left: 0 }; // margin da cerca virtual (Não apropriado alterar)
        const width = this.img.width - margin.left - margin.right; // largura da cerca
        const height = this.img.height - margin.top - margin.bottom; // altura da cerca
        const sourcePoints = [[0, 0], [width, 0], [width, height], [0, height]]; // pontos de retorno da cerca
        const targetPoints = [[0, 0], [width, 0], [width, height], [0, height]]; // target dos pontos 

        const svg = d3.select(".container").append("svg")
            .attr("width", width + margin.left + margin.right) // defininindo largura da cerca de acordo com o margin left e right 
            .attr("height", height + margin.top + margin.bottom) // defininindo altura da cerca de acordo com o margin top e bottom
            .append("g")
            .attr("transform", `translate(${margin.left} , ${margin.top})`) // posicionando no eixo da imagem a cerca virtual 
            .attr("id", "crop"); // colocando atributo id para retornar  

        const line = svg.selectAll(".line")
            .data(d3.range(0, width + 1, 40).map(function (x) { return [[x, 0], [x, height]]; })
            .concat(d3.range(0, height + 1, 40).map(function (y) { return [[0, y], [width, y]]; })))
            .enter().append("path") // gerando paths das linhas da cerca virtual
            .attr("class", "line"); // classe de estilização
            
        svg.selectAll(".handle")
            .data(targetPoints)
            .enter().append("circle") // tipo de ponto pressing nas quinas da cerca
            .attr("class", "handle") // classe de estilização
            .attr("transform", function (d) { return `translate(${d})` }) // posicionando a bola de pressing no eixo
            .attr("r", 8) // raio da bola de pressing nos 4 pontos
            .call(d3.behavior.drag()
            .origin(function (d) { return { x: d[0], y: d[1] }; }) // definindo tipo de retorno do eixo x e y de acordo com os 4 pontos da cerca
            .on("drag", dragged));

        d3.selectAll("button")
            .datum(function (d) { return JSON.parse(this.getAttribute("data-targets")); })
            .on("click", transformed())
            .call(transformed); // executando função para gerar possíveis pontos da imagem

        function dragged(d) {
            d3.select(this).attr("transform", `translate(${(d[0] = d3.event.x)} , ${(d[1] = d3.event.y)})`); // posicionando a bola de pressing nos 4 pontos
            transformed();
        }

        function transformed() {
            for (var a = [], b = [], i = 0, n = sourcePoints.length; i < n; ++i) {
                let s = sourcePoints[i], t = targetPoints[i];
                a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]), b.push(t[0]);
                a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]), b.push(t[1]);
            }
            let X = solve(a, b, true), matrix = [
                X[0], X[3], 0, X[6],
                X[1], X[4], 0, X[7],
                0, 0, 1, 0,
                X[2], X[5], 0, 1
            ].map(function (x) {
                return d3.round(x, 6);
            });
            line.attr("d", function (d) {
                return "M" + project(matrix, d[0]) + "L" + project(matrix, d[1]);
            });
        }

        function project(matrix, point) {
            point = multiply(matrix, [point[0], point[1], 0, 1]);
            return [point[0] / point[3], point[1] / point[3]];
        }

        function multiply(matrix, vector) {
            return [
                matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8] * vector[2] + matrix[12] * vector[3],
                matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9] * vector[2] + matrix[13] * vector[3],
                matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14] * vector[3],
                matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15] * vector[3]
            ];
        }
    }
}

new croppedDetection();