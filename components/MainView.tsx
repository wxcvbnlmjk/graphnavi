import {
  Flex,
  Heading,
  ListItem,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { Mosaic, MosaicNode } from "react-mosaic-component";
import GraphView from "./GraphView";
import { Table } from "apache-arrow";
import { JSONLoader } from "graph.gl";
import { EdgeFields, GraphEdge, GraphNode, NodeFields } from "../types";
import FilesArea from "./FilesArea";
// import CsvDropzone from "./CsvDropzone";
import QueryBox from "./QueryBox";
import { useRouter } from "next/router";
import { importFiles } from "../lib/save";
import QueryHelp from "./QueryHelp";

export interface Props {}

// const QueryBox = dynamic(() => import("./QueryBox"), {
//   ssr: false,
// });

const MainView: React.FC<Props> = (props) => {
  const [updateIndex, setUpdateIndex] = useState(0);
  const [nodeFieldsAvail, setNodeFieldsAvail] =
    useState<Record<NodeFields, boolean>>();
  const toast = useToast();

  const [mosaicState, setMosaicState] = useState<MosaicNode<string> | null>({
    direction: "row",
    first: "filesArea",
    second: {
      direction: "row",
      first: {
        direction: "column",
        first: "nodesQueryBox",
        second: "edgesQueryBox",
        splitPercentage: 50,
      },
      second: "graphView",
      splitPercentage: 30,
    },
    splitPercentage: 20,
  });

  const [egdesText, setEdgesText] = useState("");
  const [nodesText, setNodesText] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (router.query.gist) {
      importFiles(String(router.query.gist), "nodes.sql").then((resp) => {
        console.log(resp);
        setNodesText(resp[0].content);
        // setNodes(resp[0].content);
      });
      importFiles(String(router.query.gist), "edges.sql").then((resp) => {
        console.log(resp);
        // @ts-ignore
        setEdgesText(resp[0].content);
        // setNodes(resp[0].content);
      });
    }
  }, []);

  const [nodes, setNodes] = useState<GraphNode[]>();
  const [edges, setEdges] = useState<GraphEdge[]>();
  const graph = useMemo(() => {
    const nextUpdateIndex = updateIndex + 1;
    setUpdateIndex(nextUpdateIndex);
    const graph = JSONLoader({
      json: {
        nodes: nodes ?? [],
        edges: edges ?? [],
      },
      // nodeParser: (node: any) => ({ id: node.id }),
      // edgeParser: (edge: any) => ({
      //   id: edge.id,
      //   sourceId: edge.sourceId,
      //   targetId: edge.targetId,
      //   directed: true,
      // }),
    });
    // graph.setGraphName("123");
    return graph;
  }, [nodes, edges]);

  const handleNodeResults = (table: Table) => {
    const schema = table.schema;
    const nodes = Array.from(
      (function* () {
        for (let ri = 0; ri < table.numRows; ri++) {
          const node: Record<string, any> = {};
          for (const field of schema.fields) {
            node[field.name] = `${table.getChild(field.name)?.get(ri)}`;
          }
          // yield {
          //   id: table.getChild("id")?.get(i),
          //   name: table.getChild("name")?.get(i),
          // };
          yield node as GraphNode;
        }
      })()
    );
    setNodes(nodes);
    const hasField = (fName: NodeFields) =>
      Boolean(schema.fields.find((f) => f.name === fName));
    setNodeFieldsAvail({
      [NodeFields.ID]: hasField(NodeFields.ID),
      [NodeFields.LABEL]: hasField(NodeFields.LABEL),
      [NodeFields.COLOR]: hasField(NodeFields.COLOR),
      [NodeFields.SIZE]: hasField(NodeFields.SIZE),
    });
  };
  const handleEdgeResults = (table: Table) => {
    const edges = Array.from(
      (function* () {
        for (let i = 0; i < table.numRows; i++) {
          yield {
            id: `${i}`,
            sourceId: table.getChild(EdgeFields.SOURCE)?.get(i),
            targetId: table.getChild(EdgeFields.TARGET)?.get(i),
            directed: true,
          };
        }
      })()
    );
    setEdges(edges);
  };

  const handleError = (message: string) => {
    toast.closeAll();
    toast({
      // title: "Something went wrong",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const views: { [viewId: string]: JSX.Element } = {
    filesArea: <FilesArea onError={handleError} />,

    nodesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"}>
          Nodes
        </Heading>
        <QueryBox
          content={nodesText}
          id={"nodes"}
          isValidResult={validateNodes}
          onResult={handleNodeResults}
          onError={handleError}
          queryHelp={
            <QueryHelp
              text={`Write an SQL select query which returns the graph nodes.
              You can refer to the input files as table names.
              The query result should have the following columns:`}
              columnsList={
                <UnorderedList>
                  <ListItem>id</ListItem>
                  <ListItem>label (optional)</ListItem>
                </UnorderedList>
              }
              queryExample={`SELECT 
  column0 AS id, 
  column1 AS label
FROM my_nodes_table`}
            />
          }
        />
      </>
    ),
    edgesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"}>
          Edges
        </Heading>
        <QueryBox
          content={egdesText}
          id={"edges"}
          isValidResult={validateEdges}
          onResult={handleEdgeResults}
          onError={handleError}
          queryHelp={
            <QueryHelp
              text={`Write an SQL select query which returns the graph edges.
              You can refer to the input files as table names.
              The query result should have the following columns:`}
              columnsList={
                <UnorderedList>
                  <ListItem>source</ListItem>
                  <ListItem>target</ListItem>
                </UnorderedList>
              }
              queryExample={`SELECT 
  source_id AS source, 
  target_id AS target
FROM my_edges_table`}
            />
          }
        />
      </>
    ),
    graphView: (
      <GraphView
        updateIndex={updateIndex}
        graph={graph}
        nodeFieldsAvail={nodeFieldsAvail}
      />
    ),
  };

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  // if (!mounted) return <SpinnerPane />;

  return (
    <Flex alignItems="stretch" px={3} pt={3} pb={1} flexGrow={1}>
      <Mosaic<string>
        renderTile={(id, path) => (
          <Flex
            gap={2}
            p={3}
            direction={"column"}
            // border={"1px solid red"}
            // width={"100%"}
            // height={"100%"}
            borderRadius="md"
            overflow="hidden"
            bg={"gray.700"}
          >
            {views[id]}
          </Flex>
        )}
        value={mosaicState}
        onChange={setMosaicState}
      />
    </Flex>
  );
};

function checkHasColumn(table: Table, name: string) {
  if (!table.getChild(name)) {
    return `Column '${name}' is missing in the query result`;
  }
  return undefined;
}

function validateNodes(table: Table) {
  return checkHasColumn(table, NodeFields.ID);
}

function validateEdges(table: Table) {
  return (
    checkHasColumn(table, EdgeFields.SOURCE) ??
    checkHasColumn(table, EdgeFields.TARGET)
  );
}

export default MainView;
