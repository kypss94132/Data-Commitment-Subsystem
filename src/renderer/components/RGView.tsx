// import Graph, { Options } from 'react-graph-vis';
import { memo, useEffect, useRef, useState } from 'react';
import vis from 'vis-network';
import { DISGetType } from '../../main/discore/type';
import { useOntology, useRenderSignal } from '../Ontology';

function generateGraph(relations: DISGetType.Edge[], root: string): vis.Data {
  const nodeSet = new Set<string>();

  relations.forEach((edge) => {
    nodeSet.add(edge.from);
    nodeSet.add(edge.to);
  });

  nodeSet.delete(root);

  const nodes: vis.Node[] = Array.from(nodeSet).map((node) => ({
    id: node,
    label: node,
  }));

  if (root) {
    nodes.push({
      id: root,
      label: root,
      color: '#ff0000',
    });
  }

  const edges: vis.Edge[] = relations.map((edge) => ({
    from: edge.from,
    to: edge.to,
    arrows: {
      to: true,
    },
    label: edge.relation,
  }));

  return {
    nodes,
    edges,
  };
}

interface Props {
  graphName: string;
}

const RGView = memo(function RGView({ graphName }: Props) {
  const onto = useOntology();
  const renderSignal = useRenderSignal();
  const [relations, setRelations] = useState<DISGetType.Edge[]>(
    onto.getAllRelations(graphName),
  );
  const [rg, setRg] = useState(onto.getRootedGraph(graphName));

  useEffect(() => {
    setRelations(onto.getAllRelations(graphName));
    setRg(onto.getRootedGraph(graphName));
  }, [onto, renderSignal, graphName]);

  // console.log('rg view render')

  const graph = generateGraph(relations, rg?.rootedAt!);

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

  const container = useRef(null);

  const [network, setNetwork] = useState<vis.Network | null>(
    container.current && new vis.Network(container.current, graph, options),
  );

  return (
    // <Graph
    //   graph={graph}
    //   options={options}
    //   // events={events}
    //   // getNetwork={(network) => {
    //   //   //  if you want access to vis.js network api you can set the state in a parent component using this property
    //   // }}
    // />
    <div className="w-full h-full" ref={container} id="rgview" />
  );
});

export default RGView;
