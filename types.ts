export type Graph = any;

export type GraphNode = {
  id: string;
  name?: string;
  color?: string;
  size?: number;
};

export type GraphEdge = {
  source: string;
  target: string;
  color?: string;
  width?: number;
};

// export type GraphAttrsAvail = {
//   nodeName?: boolean;
//   nodeSize?: boolean;
//   nodeColor?: boolean;
//   edgeName?: boolean;
//   edgeWeight?: boolean;
//   edgeColor?: boolean;
// };

export enum NodeFields {
  ID    = "id"   ,
  LABEL = "label",
  SIZE  = "size" ,
  COLOR = "color",
}

export enum EdgeFields {
  ID     = "id"    ,
  SOURCE = "source",
  TARGET = "target",
  LABEL  = "label" ,
  WIDTH  = "width" ,
  COLOR  = "color" ,
}

export type GistResults = {
  isDataLoading?: boolean;
  nodesQuery?: string;
  edgesQuery?: string;
  csvFiles?  : Record<string, string>;
};
