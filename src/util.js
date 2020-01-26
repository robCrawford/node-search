
export function createLinked(nodeProps) {
  const nodes = {};

  const set = ({ pos, value }) => {
    const [ row, col ] = pos;
    const key = String(pos);
    const node = nodes[key] || (nodes[key] = {
      key,
      row,
      col,
      set: v => set({ pos, value: v })
    });
    node.value = value;
    return node;
  };

  const get = pos => nodes[ String(pos) ];

  return {
    get,
    set,
    getRoot: () => get([ 0, 0 ]),
    populate: entries => {
      entries.forEach(set);
      entries.forEach(({ pos }) => {
        const node = nodes[pos];
        Object.keys(nodeProps).forEach(k => {
          node[k] = get(nodeProps[k](node));
        });
      });
      return nodes;
    }
  }
};

export function createNodes(nodeProps, nodeConfig) {

  const { getRoot, populate } = createLinked(nodeProps);

  function getSearch(type) {
  // https://stackoverflow.com/questions/33703019/breadth-first-traversal-of-a-tree-in-javascript/33704700
  // https://stackoverflow.com/a/5278667
  /*
  DFS:
    list nodes_to_visit = {root};
    while( nodes_to_visit isn't empty ) {
      currentnode = nodes_to_visit.take_first();
      nodes_to_visit.prepend( currentnode.children );
      //do something
    }
  BFS:
    list nodes_to_visit = {root};
    while( nodes_to_visit isn't empty ) {
      currentnode = nodes_to_visit.take_first();
      nodes_to_visit.append( currentnode.children );
      //do something
    }
  */
  /* https://www.baeldung.com/java-solve-maze
    BFS gives the shortest path from the entry to the exit.
    In DFS, one child and all its grandchildren were explored first, before moving on to another child. Whereas in BFS, we'll explore all the immediate children before moving on to the grandchildren. This will ensure that all nodes at a particular distance from the parent node, are explored at the same time.
  */
    const visited = {};
    const paths = {};
    const takeNext = { queue: 'shift', stack: 'pop' }[type];

    return ({ root, target = null, isValid = () => true }) => {
      const pending = [ root ];
      const directions = Object.keys(nodeProps);
      if (!isValid(root)) {
        throw Error('Invalid root');
      }
      visited[root.key] = true;

      function traverse(node, direction) {
        const nextNode = node[ direction ];
        const nextKey = nextNode && nextNode.key;

        if (nextKey && !visited[ nextKey ] && isValid(nextNode)) {
          const nextPath = {
            ...paths[ node.key ] || {},
            [ `${direction} to ${nextKey}` ]: nextNode
          };
          if (nextNode.value === target) {
            return nextPath;
          }
          visited[ nextKey ] = true;
          paths[ nextKey ] = nextPath;
          pending.push(nextNode);
        }
        else if (nextKey) {
          visited[ nextKey ] = true;
        }
      };

      while (pending.length) {
        const node = pending[takeNext]();
        let i = directions.length;

        while (i--) {
          const result = traverse(node, directions[i]);
          if (result) {
            return result;
          }
        }
      }
    }
  }

  return {
    tree: populate(nodeConfig),
    root: getRoot(),
    bfs: getSearch('queue'),
    dfs: getSearch('stack')
  }
}
