def dfs_with_target(graph, start, target):
    visited = []
    parent = {}
    stack = [(None, start)]
    
    while stack:
        prev, current = stack.pop()
        
        if prev is not None and [prev, current] not in visited:
            visited.append([prev, current])
            
        if current == target:
            path = []
            node = current
            while node in parent:
                prev_node = parent[node]
                path.append([prev_node, node])
                node = prev_node
            path.reverse()
            return visited, path
            
        for neighbor in graph.neighbors(current):
            if neighbor not in parent and neighbor != start:
                parent[neighbor] = current
                stack.append((current, neighbor))
                
    return visited, []