declare module 'cytoscape-dagre' {
  import { Core, LayoutOptions } from 'cytoscape';
  
  interface DagreLayoutOptions extends LayoutOptions {
    name: 'dagre';
    directed?: boolean;
    padding?: number;
    spacingFactor?: number;
    nodeDimensionsIncludeLabels?: boolean;
    animate?: boolean;
    animationDuration?: number;
    animationEasing?: string;
    boundingBox?: any;
    transform?: (node: any, position: any) => any;
    ready?: () => void;
    stop?: () => void;
  }

  interface DagreExtension {
    (cytoscape: typeof Core): void;
  }

  const dagre: DagreExtension;
  export = dagre;
}