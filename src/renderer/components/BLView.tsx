// import Graph, { Events, Options } from 'react-graph-vis';
import { memo, useEffect, useRef, useState } from 'react';
import { Combination, combination } from 'js-combinatorics';
import vis from 'vis-network';
import { net } from 'electron';
import { useOntology, useRenderSignal } from '../Ontology';
import { DISGetType } from '../../main/discore/type';

function isSuperset<T>(set: Set<T>, subset: Set<T>) {
  // eslint-disable-next-line no-restricted-syntax
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

function arrayEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function generateGraph(
  atoms: string[],
  concepts: Map<string, string>,
): vis.Data {
  const len = atoms.length;
  const blItems: Set<string>[] = [];
  const edges: any[] = [];

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
    const upperStart = lowerStart + Number(combination(len, level - 1));
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

  const nodes = blItems.map((item, idx) => {
    const arr = [...item].sort();
    return {
      id: idx,
      label: concepts.get(arr.toString()) || '',
      // title: arr.join(','),
    };
  });

  return {
    nodes,
    edges,
  };
}

const BLView = memo(function BLView() {
  const onto = useOntology();
  const renderSignal = useRenderSignal();
  const [graph, setGraph] = useState<vis.Data>({ nodes: [], edges: [] });
  const container = useRef<HTMLDivElement>(null);

  console.log('render');

  useEffect(() => {
    // console.log('effect');
    // setAtoms(onto.getAllAtoms().map((a) => a.name));
    const atoms = onto.getAllAtoms().map((a) => a.name);
    const concepts = onto.getAllConcepts();
    const conceptMap = new Map<string, string>();
    conceptMap.set([].toString(), '⊥');
    conceptMap.set(atoms.toString(), '⊤');
    concepts.forEach((c) => {
      conceptMap.set(c.latticeOfConcepts.slice().sort().toString(), c.name);
    });
    atoms.forEach((a) => {
      conceptMap.set([a].toString(), a);
    });
    setGraph(generateGraph(atoms, conceptMap));
  }, [onto, renderSignal]);

  const [options, setOptions] = useState<vis.Options>({
    // autoResize: false,
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
  });

  const network =
    container.current && new vis.Network(container.current, graph, options);

  return (
    <div className="w-full h-full" ref={container} id="blview" />
  );
});

export default BLView;
