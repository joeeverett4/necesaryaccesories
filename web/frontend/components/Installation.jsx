import {
    Card,
    Select,
    List
    
  } from "@shopify/polaris";
  import { useState, useEffect, useCallback } from "react";
  import { useAuthenticatedFetch } from "../hooks";

export function Installation() {

  const fetch = useAuthenticatedFetch();
  const [themelist, updateThemeList] = useState([])
  const [selected, setSelected] = useState("");

  useEffect(() => {


    const themes = fetch("/api/themes")
    .then((response) => {
      return response.json();
    })
    .then((themes) => {
      console.log("hii")
      themes.map(theme =>{
        const id = theme.id.toString()
        const themedetails = {
          label : theme.name,
          value: id
        }
       
        updateThemeList(prevItems => [...prevItems, themedetails]);
      })
    })
    
  },[])

 
  const handleSelectChange = useCallback((value) => {
    setSelected(value);
    const asset = fetch(`/api/assets/${value}`)
    .then((response) => {
      return response.json();
    })
    .then((assets) => {
      console.log(assets)
      const istwopointoh = assets.some(
        (obj) => obj.key === "templates/index.json"
      );
      console.log(istwopointoh)
    })
  }, []);


  return (
    <>
    <Card>
     <Card.Header title = "Thanks for installing Magic App : Accessories">
      </Card.Header>      
     <Card.Section>   
        <List type="number">
      <List.Item>Open the theme you’d like to customize</List.Item>
      <List.Item>Select the product template you’d like to add the accessories to</List.Item>
      <List.Item>Click <b>Add section</b></List.Item>
      <List.Item>Select <b>Accessories</b> from the list of the apps</List.Item>
    </List> 
    </Card.Section>
    </Card>
     <Select
     label="Date range"
     options={themelist}
     onChange={handleSelectChange}
     value={selected}
   />
</>
  )
}
