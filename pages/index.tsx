import type { NextPage } from "next";
import Head from "next/head";
import {
  Button,
  ChakraProvider,
  Flex,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import MainView from "../components/MainView";
import "react-mosaic-component/react-mosaic-component.css";
import theme from "../theme";
import { Authentication, isAuthenticated } from "../components/Authentication";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import { AiFillGithub } from "react-icons/ai";
import { importFiles, saveToGithub } from "../lib/save";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const Home: NextPage = () => {
  const router = useRouter();
  let filesContent;
  const [cookies, setCookie, removeCookie] = useCookies();
  useEffect(() => {
    if (router.query.gist) {
      console.log("Found gist id");
      console.log("Fetching contents");
      importFiles(String(router.query.gist)).then((resp) => {
        filesContent = resp;
        console.log({ filesContent });
      });
    }

    if ("github-token" in cookies) {
      console.log("Found GitHub token");
      setisAuthenticatedGithub(true);
      return;
    }
  });

  function save() {
    console.log(cookies);
    saveToGithub(cookies["github-token"]);
  }

  const [isAuthenticatedGithub, setisAuthenticatedGithub] = useState(false);

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>GraphNAVI</title>
        <meta
          name="description"
          content="Network analysis and visualization tool"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex
        position={"absolute"}
        direction={"column"}
        top={0}
        left={0}
        width={"100vw"}
        height={"100vh"}
        gap={1}
      >
        <Flex
          width={"100%"}
          as={"header"}
          px={5}
          pt={3}
          mx={"auto"}
          // maxW={"6xl"}
        >
          <Flex direction={"row"} alignItems={"center"} gap={5}>
            <Heading fontSize="2xl" display={"flex"}>
              <Text color={"gray.500"}>Graph</Text>
              <Text color={"gray.100"}>NAVI</Text>
            </Heading>
            <Text fontSize="xs" color={"gray.500"}>
              Network analysis and visualization tool
            </Text>
          </Flex>
          <Spacer />
          {/*<a*/}
          {/*  href="https://www.duckdb.org"*/}
          {/*  target="_blank"*/}
          {/*  rel="noopener noreferrer"*/}
          {/*>*/}
          {/*  <Flex alignItems="center" gap={2}>*/}
          {/*    <Text fontSize={"xs"}>Powered by DuckDB</Text>*/}
          {/*    <Image*/}
          {/*      src="/duckdb.svg"*/}
          {/*      alt="DuckDB Logo"*/}
          {/*      width={30}*/}
          {/*      height={30}*/}
          {/*    />*/}
          {/*  </Flex>*/}
          {/*</a>*/}
          <Flex direction={"row"} gap={5}>
            <Authentication></Authentication>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={
                  <ChevronDownIcon
                  // size={"sm"}
                  />
                }
              >
                Save
              </MenuButton>
              <MenuList>
                <MenuItem
                  isDisabled={!isAuthenticatedGithub}
                  icon={<Icon as={AiFillGithub} h={5} w={5} />}
                  onClick={save}
                >
                  GitHub Gist
                </MenuItem>
                {/*<MenuItem*/}
                {/*  // disabled={!results || loading || error}*/}
                {/*  icon={<Icon as={DownloadIcon} h={5} w={5} />}*/}
                {/*  // onClick={handleDownload}*/}
                {/*>*/}
                {/*  Download CSV*/}
                {/*</MenuItem>*/}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        <Flex as={"main"} w={"100vw"} height={"100%"}>
          <MainView />
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Home;
