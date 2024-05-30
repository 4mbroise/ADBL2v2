'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import Sheet from '@mui/joy/Sheet';
import { Box, Button, Radio, Snackbar, Stack, SvgIcon, Typography, styled } from "@mui/joy";
import Drawer from '@mui/joy/Drawer';
import { kialoParser } from "../utils/kialo-parser";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { IconButton } from '@mui/joy';
import { Close } from "@mui/icons-material";
import { AppBar, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import GraphUI from "./graph";
import { fetchModels } from "@/service/adbl2-api";


export const AppContext = createContext(null);
export const SnackbarContext = createContext({})


export default function Home() {

  const [open, setOpen]                 = useState(false);
  const [selectedNode, setSelectedNode] = useState(undefined)
  const [modelList, setModelList]       = useState(undefined);
  const [selectedModel, selectModel]    = useState(undefined);
  const [selectedPromptTechnique, selectPromptTechnique]    = useState("0-shot");

  useContext(AppContext)

  const [snack, setSnack] = useState({
    message: '',
    color: '',
    open: false,
  });

  useEffect(() => {
    fetchModels().then(res => {
      setModelList(res["modelList"])
      selectModel(res["modelList"][0])

    })
  }, [])


  // const [user, setUser] = useState(null);

  const [graph, setGraph] = useState(null);
  const [file, setFile] = useState(null);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  console.log("graph", graph)

  const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  const fileChanged = (event) => {
    const reader = new FileReader()

    setFile(event.target.files[0])


    reader.onload = async (event) => { 
      const text = (event.target.result)
      // alert(text)
      setGraph(kialoParser(text as string))
    };
    reader.readAsText(event.target.files[0])
  };

  const deleteFile = () => {
    setGraph(null)
    setFile(null)
  }

  const handleRadioModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectModel(event.target.value);
  };

  const cytoscapeData = []
  if (!!graph) {
    graph.all().forEach(node => {
      cytoscapeData.push({data : {...node.model, label:node.model.id}})
      node.children.forEach(child => {
        cytoscapeData.push({ data : {source : child.model.id, target: node.model.id, label: child.model.id + " --> " + node.model.id}})
      });
    });
  }

  const tree2CytoscapeData = (tree) => {

    console.log("machin", tree)

    const tmp = []    

    tree.all().forEach(node => {
      tmp.push({data : {...node.model, label:node.model.id}})
      node.children.forEach(child => {
        tmp.push({ data : {source : child.model.id, target: node.model.id, label: child.model.id + " --> " + node.model.id}})
      });
    });

    return tmp
  }


  const DrawerList = (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: 'md',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Button
        component="label"
        role={undefined}
        tabIndex={-1}
        variant="outlined"
        color="neutral"
        startDecorator={
          <SvgIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
          </SvgIcon>
        }
      >
        Upload a file
        <VisuallyHiddenInput type="file" onChange={fileChanged}/>
      </Button>
      {graph !== null &&
        <Grid2 container className="justify-between">
          <Grid2 xs={8} className="align-middle truncate">{file.name}</Grid2>
          <Grid2 xs={1}>
            <IconButton onClick={deleteFile}>
              <Close/>
            </IconButton>
          </Grid2>
        </Grid2>
      }
      {!!modelList &&
        <Stack gap={1}>
          <Typography>
            Select a Large Language Model
          </Typography>
          {modelList.map((model) => (
              <Radio
                checked={selectedModel === model}
                onChange={handleRadioModelChange}
                value={model}
                label={model}
                key={model}
              />
            ))
          }
        </Stack>
      }
      <Stack gap={1}>
          <Typography>
            Select a Prompt Technique
          </Typography>
          <Radio
            checked={selectedPromptTechnique === "0-shot"}
            onChange={() => selectPromptTechnique("0-shot")}
            value="0-shot"
            label="0-shot"
            key="0-shot"
          />
          <Radio
            checked={selectedPromptTechnique === "fixed-4-shots"}
            onChange={() => selectPromptTechnique("fixed-4-shots")}
            value="fixed-4-shots"
            label="fixed-4-shots"
            key="fixed-4-shots"
          />
        </Stack>
    </Sheet>
  );

  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SnackbarContext.Provider value={{snack, setSnack}}>
        <AppContext.Provider value={{graph: graph, setGraph: setGraph, selectedNode: selectedNode, setSelectedNode: setSelectedNode, model: selectedModel, promptTechnique: selectedPromptTechnique}}>
          <AppBar component="nav" color="transparent" elevation={0}>
            <Toolbar>
              <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <h1>
                ADBL2
              </h1>
            </Toolbar>
          </AppBar>
          <Drawer 
            open={open} 
            onClose={toggleDrawer(false)}
            slotProps={{
              content: {
                sx: {
                  bgcolor: 'transparent',
                  p: { md: 3, sm: 0 },
                  boxShadow: 'none',
                },
              },
            }}
            >
            {DrawerList}
          </Drawer>
          <div className="bg-slate-200 w-11/12 flex-auto flex flex-col">
            {
              !!graph &&
              <>
                <GraphUI data={tree2CytoscapeData(graph)} graph={graph} setGraph={setGraph}></GraphUI>
                {graph.children.length}
              </>
              //<h2>{graph.model.toneInput.replace(".", " ?")}</h2>
            }
          </div>
        </AppContext.Provider>
      
        <Snackbar 
          open={snack.open} 
          autoHideDuration={2500}
          onClose={() => setSnack({open:false})}
          anchorOrigin={{vertical:'top', horizontal:'center'}}
        >
          <p>test</p>
        </Snackbar>
      </SnackbarContext.Provider>
    </main>


    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //   <div>
    //     <Button onClick={toggleDrawer(true)}>Open drawer</Button>
        // <Drawer 
        //   open={open} 
        //   onClose={toggleDrawer(false)}
        //   slotProps={{
        //     content: {
        //       sx: {
        //         bgcolor: 'transparent',
        //         p: { md: 3, sm: 0 },
        //         boxShadow: 'none',
        //       },
        //     },
        //   }}
        //   >
        //   {DrawerList}
        // </Drawer>
    //   </div>

    // </main>
  );
}
