import { useContext, useRef, useState } from "react";
import { AppContext } from "./page";
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from "cytoscape";
import elk from 'cytoscape-elk';
import ArgumentDetailsUI from "./argDetails";

cytoscape.use(elk)


export default function GraphUI() {

  const { graph, setGraph, setSelectedNode }    = useContext(AppContext);
  const [ cy, setCy ]                                         = useState(undefined)
  //const [ selectedNode, setSelectedNode ]                     = useState(undefined)
  // const setSelectedNode = useRef(null);

  console.log("graphgraphgraphgraphgraph", graph)

  const cytoscapeData: any[] = []


  graph.all().forEach(node => {
    cytoscapeData.push({data : {...node.model, label:node.model.id}})
    node.children.forEach(child => {
      cytoscapeData.push({ data : {source : child.model.id, target: node.model.id, label: child.model.id + " --> " + node.model.id}})
    });
  });

  console.log(cytoscapeData)

  if(!!cy) {
    cy.on("mouseover", "node", (x) => {
      x.preventDefault();
      console.log(x.target._private.data)
      setSelectedNode(x.target._private.data)
      console.log(cy)
    })
  }
  
  return (
    <>
      <h2>Titre</h2>
      <CytoscapeComponent 
        elements={cytoscapeData as cytoscape.ElementDefinition[]}
        style={{height: '100%', width: '100%'}} 
        className="flex-auto"
        cy={(cy) => setCy(cy)}
        layout= { 
          {
            name : 'elk',
            elk: {
              'elk.direction': 'UP',
            }
          }
        }
      />
      {/* {!!selectedNode &&
        <div>
          {selectedNode.toneInput}
        </div>
      } */}
      {/* {
        !!selectedNode &&
        <ArgumentDetailsUI arg={selectedNode} />
      } */}
    </>    
  )
}