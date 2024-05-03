declare module 'react-graph-vis' {
  import { JSX } from 'react';

  export type Configure = {
    enabled?: boolean;
    filter?: string;
    container?: any;
    showButton?: boolean;
  };

  export type Edges = {
    arrows?: any;
    arrowStrikethrough?: boolean;
    dashes?: boolean;
    color?: any;
    smooth?: any;
  };

  export type Interaction = {
    dragNodes?: boolean;
    dragView?: boolean;
    hideEdgesOnDrag?: boolean;
    hideEdgesOnZoom?: boolean;
    hideNodesOnDrag?: boolean;
    hover?: boolean;
    hoverConnectedEdges?: boolean;
    keyboard?: any;
    multiselect?: boolean;
    navigationButtons?: boolean;
    selectable?: boolean;
    selectConnectedEdges?: boolean;
    tooltipDelay?: number;
    zoomSpeed?: number;
    zoomView?: boolean;
  };

  export type Hierarchical = {
    enabled?: boolean;
    levelSeparation?: number;
    nodeSpacing?: number;
    treeSpacing?: number;
    blockShifting?: boolean;
    edgeMinimization?: boolean;
    parentCentralization?: boolean;
    direction?: 'UD' | 'DU' | 'LR' | 'RL';
    sortMethod?: 'hubsize' | 'directed';
    shakeTowards?: 'leaves' | 'roots';
  };

  export type Layout = {
    randomSeed?: number | string;
    improvedLayout?: boolean;
    clusterThreshold?: number;
    hierarchical?: boolean | Hierarchical;
  };

  export type Options = {
    autoResize?: boolean;
    width?: string;
    height?: string;
    locale?: string;
    locales?: any;
    clickToUse?: boolean;
    configure?: Configure;
    edges?: any;
    nodes?: any;
    groups?: any;
    layout?: Layout;
    interaction?: Interaction;
    manipulation?: any;
    physics?: any;
  };

  export type GraphProps = {
    graph?: { nodes: any[]; edges: any[] };
    options?: Options;
    events?: any;
    getNetwork?: (network: any) => void;
  };

  export default function Graph(props: GraphProps): JSX.Element;
}
