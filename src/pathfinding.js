import { createNodes } from "./util.js";

export function pathfindingExample() {
  //       0   1   2   3
  //     -----------------
  //  0  | A |   |   |   |
  //     -----------------
  //  1  |   | x | x | x |
  //     -----------------
  //  2  |   | x | B |   |
  //     -----------------
  //  3  |   |   |   |   |
  //     -----------------
  const obstacle = "x";

  const target = "B";

  const nodeProps = {
    north: node => [ node.row - 1, node.col ],
    east: node => [ node.row, node.col + 1 ],
    south: node => [ node.row + 1, node.col ],
    west: node => [ node.row, node.col - 1 ]
  };

  const nodeConfig = [
    { pos: [ 0, 0 ], value: "A" },
    { pos: [ 0, 1 ] },
    { pos: [ 0, 2 ] },
    { pos: [ 0, 3 ] },
    { pos: [ 1, 0 ] },
    { pos: [ 1, 1 ], value: obstacle },
    { pos: [ 1, 2 ], value: obstacle },
    { pos: [ 1, 3 ], value: obstacle },
    { pos: [ 2, 0 ] },
    { pos: [ 2, 1 ], value: obstacle },
    { pos: [ 2, 2 ], value: target },
    { pos: [ 2, 3 ] },
    { pos: [ 3, 0 ] },
    { pos: [ 3, 1 ] },
    { pos: [ 3, 2 ] },
    { pos: [ 3, 3 ] },
  ];

  const { tree, root, bfs, dfs } = createNodes(nodeProps, nodeConfig);

  console.log('tree', tree);

  let numSteps = 0;

  const isValid = n => {
    console.log('Step:', numSteps++, n.key, n.value || "-");
    return n.value !== obstacle;
  };
  let path = bfs({ root, target, isValid });

  console.log('BFS route from A to B:', path);

  numSteps = 0;

  path = dfs({ root, target, isValid });

  console.log('DFS route from A to B:', path);

};
