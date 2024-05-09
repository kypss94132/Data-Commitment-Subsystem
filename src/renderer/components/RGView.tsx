import Graph, { Options } from 'react-graph-vis';
import { useContext, useEffect, useState } from 'react';
import { DISGetType } from '../../main/discore/type';
import {
  OntologyContext,
  useOntology,
  useOntologyRenderDispatch,
  useOntologyRenderSignal,
} from '../Ontology';

function generateGraph(relations: DISGetType.Edge[], root: string) {
  const nodeSet = new Set<string>();

  relations.forEach((edge) => {
    nodeSet.add(edge.from);
    nodeSet.add(edge.to);
  });

  const nodes = Array.from(nodeSet).map((node) => ({
    id: node,
    label: node,
  }));

  nodes.push({
    id: root,
    label: root,
  });

  const edges = relations.map((edge) => ({
    from: edge.from,
    to: edge.to,
  }));

  return {
    nodes,
    edges,
  };
}

interface Props {
  graphName: string;
}

function RGView({ graphName }: Props) {
  const onto = useOntology();
  const renderSignal = useOntologyRenderSignal();
  const [relations, setRelations] = useState<DISGetType.Edge[]>(
    onto.getAllRelations(graphName),
  );
  const [rg, setRg] = useState(onto.getRootedGraph(graphName));

  console.log(onto);
  useEffect(() => {
    console.log(onto);
    setRelations(onto.getAllRelations(graphName));
    setRg(onto.getRootedGraph(graphName));
  }, [onto, renderSignal, graphName]);

  const graph = generateGraph(relations, rg?.rootedAt!);

  const [options, setOptions] = useState<Options>({
    // autoResize: true,
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
