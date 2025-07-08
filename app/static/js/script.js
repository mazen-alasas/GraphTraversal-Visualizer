let nodes = [];
let edges = [];
let network;
let path = [];

function createGraph() {
    const nodeInput = document.getElementById("nodes").value.split(",").map(n => n.trim());
    const edgeInput = document.getElementById("edges").value.split(",").map(e => e.trim());

    nodes = nodeInput.map(node => ({ id: node, label: node }));
    edges = edgeInput.map(edge => {
        const [from, to] = edge.split("-").map(n => n.trim());
        return { from, to };
    });

    const container = document.getElementById("network");
    const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
    const options = {};
    network = new vis.Network(container, data, options);

    fetch("/create_graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            nodes: nodeInput, 
            edges: edgeInput.map(e => e.split("-").map(n => n.trim())) 
        })
    });
}

function runAlgorithm() {
    const algorithm = document.getElementById("algorithm").value;
    const startNode = document.getElementById("start_node").value.trim();
    const targetNode = document.getElementById("target_node").value.trim();

    fetch("/run_algorithm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            algorithm: algorithm, 
            start_node: startNode,
            target_node: targetNode 
        })
    })
    .then(response => response.json())
    .then(data => {
        highlightNodes(data.visited);
        path = data.path;
    });
}

function highlightNodes(visitedEdges) {
    edges = edges.map(edge => ({
        from: edge.from,
        to: edge.to,
        color: { color: 'black' }
    }));
    
    let delay = 0;
    visitedEdges.forEach(([from, to]) => {
        setTimeout(() => {
            edges.push({ from, to, color: { color: 'red' } });
            network.setData({ nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) });
        }, delay);
        delay += 1000;
    });
}

function printPath() {
    const pathDisplay = document.getElementById("path_display");
    pathDisplay.innerHTML = "";
    
    if (path.length === 0) {
        pathDisplay.textContent = "Target node not found!";
        return;
    }
    
    edges = edges.map(edge => {
        const isInPath = path.some(([p1, p2]) => 
            (edge.from === p1 && edge.to === p2) || 
            (edge.from === p2 && edge.to === p1)
        );
        return {
            from: edge.from,
            to: edge.to,
            color: { color: isInPath ? 'green' : 'black' },
            width: isInPath ? 3 : 1
        };
    });
    
    network.setData({ nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) });
    
    const pathNodes = [];
    path.forEach(([from, to]) => {
        if (!pathNodes.includes(from)) pathNodes.push(from);
        if (!pathNodes.includes(to)) pathNodes.push(to);
    });
    
    pathDisplay.textContent = "Path: " + pathNodes.join(" → ");
}