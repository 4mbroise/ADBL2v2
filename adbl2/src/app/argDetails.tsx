import Close from "@mui/icons-material/Close"
import { Box, Button, CircularProgress, Grid, IconButton, LinearProgress, Skeleton, Textarea } from "@mui/joy"
import Grid2 from "@mui/material/Unstable_Grid2"
import { useEffect, useRef, useState } from "react"
import NorthIcon from '@mui/icons-material/North';
import { Bar } from "react-chartjs-2";
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AddChild from "./addChildArgumentModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function ArgumentDetailsUI(props) {



  const [ isVisible, setVisible ] = useState(true)
  const [ isInfering, setIsInfering ] = useState(true)
  const [ arg, setArg ] = useState(props.bottomArg.toneInput)


  // console.log("topArg", props.topArg)
  // console.log("bottomArg", props.bottomArg)

  useEffect(() => {
    setArg(props.bottomArg.toneInput)
  }, [props.bottomArg.toneInput])

  useEffect(() => {

    // props.topArg.toneInput
    // props.bottomArg.toneInput

    setIsInfering(true)
    if(!!props.topArg){
      console.log("INFERING")
      sleep(3000).then(() => { setIsInfering(false); console.log("END INFERENCE") })
    } else {
      setIsInfering(false)
    }    
  }, [props.topArg, props.bottomArg])

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  
  const handleOutSideClick = (event) => {
    console.log(ref1)
    if (!ref1.current?.contains(event.target)) {
      console.log("click outside")
      console.log(event)
      props.close(undefined)
    }
  };

  // useEffect(() => {
  //   const handleOutSideClick = (event) => {
  //     console.log(ref1)
  //     if (!ref1.current?.contains(event.target)) {
  //       console.log("click outside")
  //       console.log(event)
  //       props.close(undefined)
  //     }
  //   };

  //   window.addEventListener("mousedown", handleOutSideClick);

  //   return () => {
  //     window.removeEventListener("mousedown", handleOutSideClick);
  //   };
  // }, [ref1, ref2]);

  const style1 = { 
    top:props.posY,
    left: props.posX,
    width: '30%',
    visibility: "visible",
    borderRadius: 10
  }

  const style2 = { 
    backgroundColor:"#d3d3d3"
  }

  let topArgColor = "#d3d3d3"
  let topArgBorderColor = "#d3d3d3"
  if(!!props.topArg) {
    if(props.topArg.stance === "Pro") {
      topArgColor = "#a7f1a7"
      topArgBorderColor = "#1cb01c"
    } else if (props.topArg.stance === "Con") {
      topArgColor = "#ffa899"
      topArgBorderColor = "#cc1f00"
    } else if (props.topArg.stance === "Root") {
      topArgColor = "#80bfff"
      topArgBorderColor = "#0066cc"
    }  
  }


  let bottomArgColor = "#d3d3d3"
  let bottomBorderArgColor = "#d3d3d3"
  if(props.bottomArg.stance === "Pro") {
    bottomArgColor = "#a7f1a7"
    bottomBorderArgColor = "#1cb01c"
  } else if (props.bottomArg.stance === "Con") {
    bottomArgColor = "#ffa899"
    bottomBorderArgColor = "#cc1f00"
  } else if (props.bottomArg.stance === "Root") {
    bottomArgColor = "#80bfff"
    bottomBorderArgColor = "#0066cc"
  }



  const labels = ['mmhm'];
  const tmpPercent = Math.floor(Math.random() * 100)
  const tmpData = {
    labels,
    datasets: [
      {
        label: 'Attack',
        data: [tmpPercent],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Support',
        data: [100-tmpPercent],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  const options = {
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
           title : () => null
        }
     }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          display: false
        }
      },
    },
  };

  return (
    <Box className="absolute bg-white" style={style1} ref={ref1} border={2}>
        {/* <div className="absolute w-full flex flex-row-reverse">
          <IconButton onClick={()=>props.close(undefined)} className="fixed">
            <Close/>
          </IconButton>
        </div>
        <div className="invisible">
          Title
        </div>
        <div className="invisible">
          Title
        </div> */}
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <div className="invisible">
            <IconButton onClick={()=>props.close(undefined)}>
              <Close/>
            </IconButton>
          </div>
          <div>
            Title
          </div>
          <div>
            <IconButton onClick={()=>props.close(undefined)}>
              <Close/>
            </IconButton>
          </div>
        </Grid>
        <Box className=" w-full h-full rounded-xl" overflow={"auto"} padding={2} paddingTop={2}/* style={style2} */ >
          <Grid container
                direction="column"
                justifyContent="center"
                gap={3}
          >  
            {!!props.topArg &&
              <>
                <Box bgcolor={topArgColor} p={1} borderRadius={4} /* border={2} borderColor={topArgBorderColor} */>
                  <Textarea size="lg" name="Size" value={props.topArg.toneInput} key={props.topArg.toneInput} className="pointer-events-none"/>
                </Box>
                <div className="self-center">
                  <NorthIcon fontSize="large" htmlColor={bottomArgColor}/>
                </div>
              </>
            }

            <div>
              <Box bgcolor={bottomArgColor} p={1} borderRadius={4} border={3} borderColor={bottomBorderArgColor}>
                <Textarea size="lg" name="Size" value={arg} key={props.bottomArg.toneInput} onChange={e => setArg(e.target.value)}/>
              </Box>
            </div>

            { !!props.topArg &&
              <Box width={"100%"} className="h-32 relative justify-center">
                { isInfering &&
                  <div className="absolute h-32 w-full flex align-middle">
                    <Skeleton></Skeleton>
                  </div>
                }
                
                { !isInfering &&
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    className="h-32 content-center"
                  >
                    {/* <Grid item xs={6} className="absolute h-32 flex justify-center">
                      <Bar options={options} data={tmpData} className="absolute m-0" />
                    </Grid> */}
                    <Grid item xs={9}>
                      <Bar options={options} data={tmpData} />
                    </Grid>
                    <Grid item xs={3} textAlign="center">
                      <Button onClick={function(){}}
                        variant="plain"
                        size="lg"
                        style={{"border-radius": "99999px"}}
                      >
                        <RefreshIcon fontSize="large"/>
                      </Button>
                    </Grid>
                  </Grid>
                  
                }
              </Box>
            }
            <div>
              <AddChild/>
            </div>
            <Button variant="solid" startDecorator={<SaveIcon/>} endDecorator={<Close/>} color="danger">
              Save and Close
            </Button>
          </Grid>
        </Box>
    </Box>

  )
}