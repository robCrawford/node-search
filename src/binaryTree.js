import { createNodes } from "./util.js";

export function binaryTreeExample() {
  // row 0            1
  //                 / \
  //                /   \
  //               /     \
  // row 1        2       3
  //             / \     / \
  //            /   \   /   \
  // row 2     4     5 6     7

  // parent is the same for both child nodes, because `3 >> 1 === 1` and `2 >> 1 === 1`.
  // 8   4   2   1
  //     1   1  // 3
  //         1  // 3 >> 1
  //     1   0  // 2
  //         1  // 2 >> 1
  const nodeProps = {
    left: node => [ node.row + 1, node.col * 2 ],
    right: node => [ node.row + 1, node.col * 2 + 1 ],
    parent: node => [ node.row - 1, node.col >> 1 ]
  };

  const nodeConfig = [
    { pos: [ 0, 0 ], value: "1" },
    { pos: [ 1, 0 ], value: "2" },
    { pos: [ 1, 1 ], value: "3" },
    { pos: [ 2, 0 ], value: "4" },
    { pos: [ 2, 1 ], value: "5" },
    { pos: [ 2, 2 ], value: "6" },
    { pos: [ 2, 3 ], value: "7" }
  ];

  const { tree, root, bfs, dfs } = createNodes(nodeProps, nodeConfig);

  console.log('tree', tree);

  let tw = root;
  tw = root.left;
  tw = tw.right;
  console.log(tw);
  console.log('parent', tw.parent);

  tw.set("999");
  console.log(tw.value);

  const bfsKeys = [];

  bfs({ root, isValid: n => {
    bfsKeys.push(n.key);
    return true;
  }});
  console.log('BFS keys', bfsKeys);

  const dfsKeys = [];

  dfs({ root, isValid: n => {
    dfsKeys.push(n.key);
    return true;
  }});
  console.log('DFS keys', dfsKeys);
}
