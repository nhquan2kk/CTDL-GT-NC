const prompt = require("prompt-sync")();
class Vertex {
    constructor(name) {
        this.name = name;
        this.color = null;
        this.neighbors = [];
    }

    addNeighbor(neighbor) {
        this.neighbors.push(neighbor);
    }
}

class Graph {
    constructor() {
        this.vertices = {};
    }

    addVertex(vertex) {
        this.vertices[vertex.name] = vertex;
    }

    getVertex(name) {
        return this.vertices[name];
    }

    colorGraph() {
        const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
        const visited = {};

        for (const vertexName in this.vertices) {
            if (!visited[vertexName]) {
                const vertex = this.getVertex(vertexName);

                // Tìm màu tồi nhất có thể sử dụng cho đỉnh
                const availableColors = vertex.neighbors.map(neighbor => neighbor.color);
                vertex.color = colors.find(color => !availableColors.includes(color));

                visited[vertexName] = true;
            }
        }
    }
}

function main() {
    const graph = new Graph();

    // Nhập số lượng đỉnh từ menu
    const numVertices = parseInt(prompt('Nhập số lượng đỉnh:'));

    // Tạo các đỉnh
    for (let i = 0; i < numVertices; i++) {
        const vertexName = prompt(`Nhập tên đỉnh ${i + 1}:`);
        graph.addVertex(new Vertex(vertexName));
    }

    // Nhập số lượng cạnh từ menu
    const numEdges = parseInt(prompt('Nhập số lượng cạnh:'));

    // Thêm các cạnh vào đồ thị
    for (let i = 0; i < numEdges; i++) {
        const vertexName1 = prompt(`Nhập tên đỉnh 1 của cạnh ${i + 1}:`);
        const vertexName2 = prompt(`Nhập tên đỉnh 2 của cạnh ${i + 1}:`);

        const vertex1 = graph.getVertex(vertexName1);
        const vertex2 = graph.getVertex(vertexName2);

        vertex1.addNeighbor(vertex2);
        vertex2.addNeighbor(vertex1);
    }

    // Thực hiện tô màu đồ thị
    graph.colorGraph();

    // In kết quả
    console.log('Kết quả tô màu đồ thị:');
    for (const vertexName in graph.vertices) {
        const vertex = graph.getVertex(vertexName);
        console.log(`Đỉnh ${vertex.name}: ${vertex.color}`);
    }
}

// Gọi hàm chính
main();