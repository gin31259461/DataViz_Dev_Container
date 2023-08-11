type GraphNode = {
  id: number;
  labels: string[];
};

type GraphEdge = {
  id: number;
  label: string | null;
  head: number;
  tail: number;
};

type Mapping = Record<string, number>;

type TargetValueDistribution = {
  low: number;
  medium: number;
  high: number;
};
export interface DecisionTreePath {
  path: number[];
  targetValueDistribution: TargetValueDistribution;
  nodeLabel: Record<number, string[]>;
}

export interface DecisionTreeGraph {
  nodes: GraphNode[];
  edges: Record<string, GraphEdge>; // 使用字串作為鍵，例如 "node1_node2"
  mappings: Record<string, Mapping>;
}

export type nodeDataProps = Record<number, Object[]>;

export function parsePath(graph: DecisionTreeGraph, rootId: number = 0): DecisionTreePath[] {
  const paths: DecisionTreePath[] = [];

  if (!graph) return [];

  // DFS : Depth-First Search
  function dfs(currentId: number, path: number[]): void {
    // 將目前節點加入路徑中
    path.push(currentId);

    const outgoingEdges = Object.values(graph.edges).filter((edge) => edge.head === currentId);

    if (outgoingEdges.length === 0) {
      // 如果目前節點沒有出邊（即為最底層節點），將路徑加入結果中
      const lastNodeID = path[path.length - 1];
      const node = graph.nodes[lastNodeID];
      const targetValue: number[] = JSON.parse(node.labels[node.labels.length - 1].split(' ').slice(2).join(''));
      let sum = 0;
      targetValue.forEach((n) => (sum += n));

      const nodeLabel: Record<number, string[]> = {};
      nodeLabel[path[path.length - 1]] = node.labels;

      /*
        如果下一個 Node ID 是上個 +1 則是 true，不然的話是 false
      */
      for (let i = 0; i + 1 < path.length; i++) {
        const nodeID = path[i];
        if (graph.nodes[nodeID].labels.length == 4) {
          const nextNodeID = path[i + 1];
          const conditionLabels = graph.nodes[nodeID].labels[0].split(' ');
          let newFilter = ``,
            newFilterQuoted = '';
          const feature = conditionLabels[0];
          if (!graph.mappings[feature]) {
            const newLabels = [...graph.nodes[nodeID].labels];
            if (nodeID + 1 != nextNodeID) {
              const condition = newLabels[0];
              const splitCondition = condition.split(' ');
              splitCondition[1] = '>';
              newLabels[0] = splitCondition.join(' ');
            }
            nodeLabel[nodeID] = newLabels;
            continue;
          } else if (nodeID + 1 == nextNodeID) {
            // left edge (<=) => true
            const value = Math.ceil(Number(conditionLabels[2]));
            for (let i = value; i >= 0; i--) {
              newFilter += `"` + graph.mappings[feature][i.toString()] + `",`;
              newFilterQuoted += "'" + graph.mappings[feature][i.toString()] + "',";
            }
          } else {
            // right edge (>) => false
            const value = Math.floor(Number(conditionLabels[2]));
            for (let i = value; i < Object.values(graph.mappings[feature]).length; i++) {
              newFilter += `"` + graph.mappings[feature][i.toString()] + `",`;
              newFilterQuoted += "'" + graph.mappings[feature][i.toString()] + "',";
            }
          }
          nodeLabel[nodeID] = [
            feature,
            feature + ' in (' + newFilter.slice(0, -1) + ')',
            feature + ' in (' + newFilterQuoted.slice(0, -1) + ')',
            ...graph.nodes[nodeID].labels.slice(1),
          ];
        }
      }

      paths.push({
        path: [...path],
        targetValueDistribution: {
          low: targetValue[0] / sum,
          medium: targetValue[1] / sum,
          high: targetValue[2] / sum,
        },
        nodeLabel: nodeLabel,
      });
    } else {
      // 遍歷目前節點的所有出邊
      for (const edge of outgoingEdges) {
        const nextId = edge.tail;

        // 遞迴呼叫深度優先搜索
        dfs(nextId, path);
      }
    }

    // 回溯，從路徑中移除目前節點
    path.pop();
  }

  dfs(rootId, []);

  return paths;
}
