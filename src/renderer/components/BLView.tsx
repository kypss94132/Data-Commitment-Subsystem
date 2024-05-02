import Graph, { Option } from 'react-graph-vis';
import { useContext } from 'react';
import { Combination, PowerSet, combination } from 'js-combinatorics';
import { DISGetType } from '../../main/discore/type';
import ontology from '../Ontology';

interface Props {
  concepts: DISGetType.Concept[];
  atoms: DISGetType.Atom[];
}

function isSuperset<T>(set: Set<T>, subset: Set<T>) {
  // eslint-disable-next-line no-restricted-syntax
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

function BLView() {
  const onto = useContext(ontology);
  const atoms = onto.getAllAtoms().map((a) => a.name);
  const concepts: Set<string[]> = new Set(
    onto.getAllConcepts().map((c) => c.latticeOfConcepts),
  );
  const len = atoms.length;
  const blItems: Set<string>[] = [];
  for (let i = 0; i < blItems.length; i += 1) {
    console.log(blItems.at(i));
  }
  // const nodes = [];
  const edges = [];

  blItems.push(new Set());

  for (let i = 0; i < len; i += 1) {
    blItems.push(new Set([atoms[i]]));
  }

  for (let i = 2; i <= len; i += 1) {
    const comUpper = new Combination(atoms, i);
    const combUpper = [...comUpper];
    for (let j = 0; j < combUpper.length; j += 1) {
      blItems.push(new Set(combUpper[j].values()));
    }
  }

  for (let i = 0; i < len; i += 1) {
    edges.push({ from: 0, to: i + 1 });
    edges.push({ from: blItems.length - 2 - i, to: blItems.length - 1 });
  }

  let lowerStart = 1;
  for (let level = 2; level < len; level += 1) {
    const upperStart = lowerStart + len;
    for (let i = 0; i < combination(len, level); i += 1) {
      const upperIdx = upperStart + i;
      for (let j = 0; j < combination(len, level - 1); j += 1) {
        const lowerIdx = lowerStart + j;
        if (isSuperset(blItems[upperIdx], blItems[lowerIdx])) {
          edges.push({ from: lowerIdx, to: upperIdx });
        }
      }
    }
    lowerStart = upperStart;
  }

  //   const comLower = new Combination(atoms, i - 1);
  //   const combLower = [...comLower];
  // }

  const nodes = blItems.map((item, idx) => {
    return {
      id: idx,
      label: item.size === 0 ? '⊥' : [...item].join(','),
      title: [...item].join(','),
    };
  });

  const graph = {
    nodes,
    edges,
  };

  const options: Option = {
    autoResize: true,
    layout: {
      hierarchical: {
        direction: 'DU',
        sortMethod: 'directed',
        enabled: true,
      },
    },
    edges: {
      color: '#000000',
    },
    // height: '500px',
    // configure: {
    //   // showButton: false,
    // },
    interaction: {
      dragNodes: false,
    },
  };

  const events = {
    select(event) {
      const { nodes, edges } = event;
    },
  };

  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={(network) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />
  );
}

export default BLView;
