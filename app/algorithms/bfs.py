from collections import deque

def bfs_with_target(graph, start, target):
    visited = []
    parent = {}
    queue = deque([(None, start)])
    
    while queue:
        prev, current = queue.popleft()
        
        if prev is not None:
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
                queue.append((current, neighbor))
                
    return visited, []