from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str

class Edge(BaseModel):
    source: str
    target: str

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def is_dag(nodes, edges):
    from collections import defaultdict, deque
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    for node in nodes:
        in_degree[node["id"]] = 0
    for edge in edges:
        graph[edge["source"]].append(edge["target"])
        in_degree[edge["target"]] += 1
    queue = deque(node for node in in_degree if in_degree[node] == 0)
    visited_count = 0
    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return visited_count == len(nodes)

@app.post('/pipelines/parse')
async def parse_pipeline(request: Request):
    pipeline = await request.json()
    num_nodes = len(pipeline["nodes"])
    num_edges = len(pipeline["edges"])
    dag_status = is_dag(pipeline["nodes"], pipeline["edges"])
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag_status
    }
