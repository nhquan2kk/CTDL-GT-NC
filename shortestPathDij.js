const prompt = require("prompt-sync")();

// Định nghĩa lớp đỉnh
class Vertex {
    constructor(name) {
        this.name = name;
        this.adjacent = [];
        this.visited = false;
        this.distance = Infinity;
        this.previous = null;
    }

    addNeighbor(neighbor, weight) {
        this.adjacent.push({ vertex: neighbor, weight: weight });
    }
}

// Định nghĩa lớp đồ thị
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

    dijkstra(startName) {
        const startVertex = this.getVertex(startName);
        startVertex.distance = 0;
        const queue = [startVertex];

        while (queue.length > 0) {
            const currentVertex = queue.shift();
            currentVertex.visited = true;

            for (const neighbor of currentVertex.adjacent) {
                const { vertex, weight } = neighbor;
                const distance = currentVertex.distance + weight;

                if (distance < vertex.distance) {
                    vertex.distance = distance;
                    vertex.previous = currentVertex;
                }

                if (!vertex.visited) {
                    queue.push(vertex);
                }
            }
        }
    }

    getShortestPath(startName, endName) {
        const endVertex = this.getVertex(endName);
        const path = [endVertex];

        let currentVertex = endVertex;
        while (currentVertex.previous) {
            path.unshift(currentVertex.previous);
            currentVertex = currentVertex.previous;
        }

        const distance = endVertex.distance;
        return { path, distance };
    }
}

// Hàm chính
function main() {
    const graph = new Graph();

    // Tạo các đỉnh
    const a = new Vertex('A');
    const b = new Vertex('B');
    const c = new Vertex('C');
    const d = new Vertex('D');
    const e = new Vertex('E');
    const f = new Vertex('F');

    // Thêm các đỉnh vào đồ thị
    graph.addVertex(a);
    graph.addVertex(b);
    graph.addVertex(c);
    graph.addVertex(d);
    graph.addVertex(e);
    graph.addVertex(f);

    // Thiết lập các cạnh và trọng số
    a.addNeighbor(b, 4);
    a.addNeighbor(c, 2);
    b.addNeighbor(d, 5);
    c.addNeighbor(b, 1);
    c.addNeighbor(d, 8);
    c.addNeighbor(e, 10);
    d.addNeighbor(e, 2);
    d.addNeighbor(f, 6);
    e.addNeighbor(f, 2);

    // Nhập điểm bắt đầu và điểm kết thúc từ menu
    const startVertexName = prompt('Nhập tên đỉnh bắt đầu:');
    const endVertexName = prompt('Nhập tên đỉnh kết thúc:');

    // Tìm đường đi ngắn nhất
    graph.dijkstra(startVertexName);
    const { path, distance } = graph.getShortestPath(startVertexName, endVertexName);

    // In kết quả
    if (path.length === 1 && path[0].name === endVertexName) {
        console.log(`Không tìm thấy đường đi từ ${startVertexName} đến ${endVertexName}`);
    } else {
        const pathNames = path.map(vertex => vertex.name).join(' -> ');
        console.log(`Đường đi ngắn nhất từ ${startVertexName} đến ${endVertexName}: ${pathNames}`);
        console.log(`Khoảng cách: ${distance}`);
    }
}

// Gọi hàm chính
main();