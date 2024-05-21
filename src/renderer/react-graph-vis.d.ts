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

  export type ClickEvent = {
    nodes: any[];
    edges: any[];
    event: any;
    pointer: {
      DOM: { x: number; y: number };
      canvas: { x: number; y: number };
    };
    items: any[];
  };

  export type DeselectEvent = ClickEvent & {
    previousSelection: {
      nodes: any[];
      edges: any[];
    };
  };

  export type DraggingEvent = ClickEvent & {
    controlEdge: {
      from: number;
      to: number;
    };
  };

  export type NodeEvent = {
    node: number;
  };

  export type EdgeEvent = {
    edge: number;
  };

  export type ZoomEvent = {
    direction: '+' | '-';
    scale: number;
    pointer: {
      x: number;
      y: number;
    };
  };

  export type Events = {
    // Events triggered by human interaction, selection, dragging etc.
    click?: (event: ClickEvent) => void;
    doubleClick?: (event: ClickEvent) => void;
    oncontext?: (event: ClickEvent) => void;
    hold?: (event: ClickEvent) => void;
    release?: (event: ClickEvent) => void;
    select?: (event: ClickEvent) => void;
    selectNode?: (event: ClickEvent) => void;
    selectEdge?: (event: ClickEvent) => void;
    deselectNode?: (event: DeselectEvent) => void;
    deselectEdge?: (event: DeselectEvent) => void;
    dragStart?: (event: ClickEvent) => void;
    dragging?: (event: ClickEvent) => void;
    dragEnd?: (event: ClickEvent) => void;
    controlNodeDragging?: (event: DraggingEvent) => void;
    controlNodeDragEnd?: (event: DraggingEvent) => void;
    hoverNode?: (event: NodeEvent) => void;
    blurNode?: (event: NodeEvent) => void;
    hoverEdge?: (event: EdgeEvent) => void;
    blurEdge?: (event: EdgeEvent) => void;
    zoom?: (event: ZoomEvent) => void;
    showPopup?: (id: number) => void;
    hidePopup?: () => void;
    // Events triggered the physics simulation. Can be used to trigger GUI updates.
    startStabilizing?: () => void;
    stabilizationProgress?: (event: {
      iterations: number; // iterations so far,
      total: number; // total iterations in options
    }) => void;
    stabilizationIterationsDone?: () => void;
    stabilized?: (event: {
      iterations: number; // iterations so far,
    }) => void;
    // Event triggered by the canvas.
    resize?: (event: {
      width: number; // the new width  of the canvas
      height: number; // the new height of the canvas
      oldWidth: number; // the old width  of the canvas
      oldHeight: number; // the old height of the canvas
    }) => void;
    // Events triggered by the rendering module. Can be used to draw custom elements on the canvas.
    initRedraw?: () => void;
    beforeDrawing?: (ctx: any) => void;
    afterDrawing?: (ctx: any) => void;
    // Event triggered by the view module.
    animationFinished?: () => void;
    // Event triggered by the configuration module.
    configChange?: (config: any) => void;
  };

  export type GraphProps = {
    graph?: { nodes: any[]; edges: any[] };
    options?: Options;
    events?: Events;
    getNetwork?: (network: any) => void;
  };

  export default function Graph(props: GraphProps): JSX.Element;
}
