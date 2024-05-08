import Graph, { Options } from 'react-graph-vis';
import { useContext, useEffect, useState } from 'react';
import { DISGetType } from '../../main/discore/type';
import { OntologyContext, useOntology, useOntologyRenderDispatch, useOntologyRenderSignal } from '../Ontology';

interface Props {
  concepts: DISGetType.Concept[];
  atoms: DISGetType.Atom[];
}

function generateGraph(relations: DISGetType.Edge[]) {
  const nodeSet = new Set<string>();

  relations.forEach((edge) => {
    nodeSet.add(edge.from);
    nodeSet.add(edge.to);
  });

  const nodes = Array.from(nodeSet).map((node) => ({
    id: node,
    label: node,
  }));

  const edges = relations.map((edge) => ({
    from: edge.from,
    to: edge.to,
  }));

  return {
    nodes,
    edges,
  };
}

function RGView() {
  const onto = useOntology();
  const renderSignal = useOntologyRenderSignal();
  const renderDispatch = useOntologyRenderDispatch();
  const [relations, setRelations] = useState<DISGetType.Edge[]>(
    onto.getAllRelations('r1'),
  );

  console.log(onto);
  useEffect(() => {
    console.log(onto);
    setRelations(onto.getAllRelations('r1'));
  }, [onto, renderSignal]);

  const graph = generateGraph(relations);

  const [options, setOptions] = useState<Options>({
    autoResize: true,
    // layout: {
    //   hierarchical: {
    //     direction: 'DU',
    //     sortMethod: 'directed',
    //     enabled: true,
    //   },
    // },
    edges: {
      color: '#000000',
    },
    // height: '500px',
    // configure: {
    //   // showButton: false,
    // },
    interaction: {
      dragNodes: true,
    },
  });

  const events = {
    select(event) {
      const { nodes, edges } = event;
    },
  };

  return (
    <Graph
      graph={graph}
      options={options}
      // events={events}
      // getNetwork={(network) => {
      //   //  if you want access to vis.js network api you can set the state in a parent component using this property
      // }}
    />
  );
}

export default RGView;
