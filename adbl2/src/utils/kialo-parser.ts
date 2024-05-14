import TreeModel from "tree-model";
import { Argument } from "../types/argument";

export function kialoParser(kialoText: string) {
  let lines
  lines = kialoText.split("\r\n").filter((x)=>x !=="").map((x) => x.trim())

  const discussionAndThesis = lines.slice(0, 4);
  lines = lines.slice(4, lines.length)

  
  lines = lines.map((x) => x.replace("Pro:","Pro"))
  lines = lines.map((x) => x.replace("Con:","Con"))

  // Removing sources (lines at the end of kialo files)
  lines = lines.slice(0,lines.indexOf("Sources:"))


  const tmp = []

  for (let index = 0; index < lines.length; index+=2) {
    const element1 = lines[index].split(" ");
    const element2 = lines[index+1];

    tmp.push([element1[0], element1[1], element2])
  }

  lines = tmp

  // console.log(discussionAndThesis)
  // console.log(lines)

  const tree = new TreeModel()
  
  const rootTmp: Argument = {
    id:         "1.",
    stance:     "Root",
    toneInput:  discussionAndThesis[3]
  } 
  
  const root = tree.parse(rootTmp)

  console.log("root", root)

  for (let index = 0; index < lines.length; index++) {
    const id        = lines[index][0];
    const stance    = lines[index][1];
    const toneInput = lines[index][2];

    const parentId = id.slice(0, id.slice(0,id.length-1).lastIndexOf(".")+1)

    // console.log(id, parentId)

    const parent = root.first(x => x.model.id === parentId)
    if ( parent !== undefined) {
      // console.log(parent)
      
      const arg = {
        id:         id,
        stance:     stance,
        toneInput:  toneInput
      } as Argument
   
      parent.addChild(tree.parse(arg))
    } else {
      console.log(id, parentId)
    }
  }

  // console.log(lines.length + 1 ) // +1 for the root node
  // console.log(root.all(() => true).length)

  return root

}
