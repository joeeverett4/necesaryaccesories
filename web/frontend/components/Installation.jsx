import {
    Card,
    Select,
    List,
    Banner,
    Layout,
    Button,
    
  } from "@shopify/polaris";
  import { useState, useEffect, useCallback } from "react";
  import { useAuthenticatedFetch } from "../hooks";
  import { useNavigate } from "@shopify/app-bridge-react";

export function Installation() {

  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const [themelist, updateThemeList] = useState([])
  const [selected, setSelected] = useState("");
  const [isAcceptableTheme, checkIfIsAcceptableTheme] = useState(false)

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
       if(themelist.length == 0){
        updateThemeList(prevItems => [...prevItems, themedetails]);
       } 
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
      checkIfIsAcceptableTheme(istwopointoh)
    })
  }, []);


    const banner = isAcceptableTheme ? (
      <Banner
      title="Your theme is compatabile with Accesories"
      status="success"
      
      onDismiss={() => {}}
    />
    ) :
    <Banner
      title="Unfortunately we don't support vintage themes. Please continue with an online store 2.0 theme to continue"
      status="critical"
    >
    </Banner>
    ;
  
   const info = isAcceptableTheme ? (
    <Card>
    <Card.Header title = "Installation instructions">
     </Card.Header>      
    <Card.Section>   
       <List type="number">
     <List.Item>Open the theme you’d like to customize</List.Item>
     <List.Item>Select the product template you’d like to add the accessories to</List.Item>
     <List.Item>Click <b>Add section</b></List.Item>
     <List.Item>Select <b>Accessories</b> from the list of the apps</List.Item>
   </List> 
   </Card.Section>
   </Card> ) :
   null ;
   

  return (
    <Layout>
      
    <Layout.Section>
     <Select
     label="Select a theme to add accessories"
     options={themelist}
     onChange={handleSelectChange}
     value={selected}
   />
   </Layout.Section>
   <Layout.Section>
 {banner}
 </Layout.Section>

 <Layout.Section>
    {info}
    </Layout.Section>

    <Layout.Section>
    <Button primary onClick = {() => navigate("/")}>Continue</Button>
    </Layout.Section>

   

</Layout>
  )
}
