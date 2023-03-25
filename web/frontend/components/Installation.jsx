import {
    Card,
    Select,
    List,
    Banner,
    Layout,
    Button,
    SkeletonBodyText,
    Spinner,
    Stack,
    Heading
    
  } from "@shopify/polaris";
  import { useState, useEffect, useCallback } from "react";
  import { useAuthenticatedFetch } from "../hooks";
  import { useNavigate } from "@shopify/app-bridge-react";

export function Installation() {
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const [themelist, updateThemeList] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  const [isloading, setisLoading ] = useState(true)
  const [isSpinning, setisSpinning] = useState(false)
  const [selected, setSelected] = useState("");
  const [isAcceptableTheme, checkIfIsAcceptableTheme] = useState(false);

  useEffect(() => {
    fetch("/api/themes")
      .then((response) => {
        return response.json();
      })
      .then((sortedThemes) => {
        console.log("hii");
  
        const newThemeList = sortedThemes.map((theme) => {
          const id = theme.id.toString();
          const themedetails = {
            label: theme.name,
            value: id,
            role: theme.role,
          };
          return themedetails;
        });
  
        updateThemeList(newThemeList);
     
      });
  }, []);

  useEffect(() => {
    if (themelist.length > 0) {
      handleSelectChange(themelist[0].value);
     
    }
  }, [themelist]);


const spinner = isSpinning ? (
<Spinner accessibilityLabel="Small spinner example" size="small" />

) : null;


 
  const handleSelectChange = useCallback((value) => {
    setSelected(value);
    setisSpinning(true)
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
    .then((load) => {
      setisLoading(false);
      setisSpinning(false)
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

   const button = isAcceptableTheme ? (
    <Button primary onClick = {() => navigate("/")}>Continue</Button>
   ) : null ;
   

   return (
    <Layout>
      {isloading ? (
        <SkeletonBodyText />
      ) : (
        <>
          <Layout.Section>
          <Heading>Select a theme to add accessories to </Heading>
          </Layout.Section>
          <Layout.Section>
            
            <Stack spacing="loose" alignment = "center">
              <Stack.Item fill>
            <Select
              label=""
              options={themelist}
              onChange={handleSelectChange}
              value={selected}
            />
            </Stack.Item>
            <Stack.Item>
            {spinner}
            </Stack.Item>
            </Stack>
          </Layout.Section>
          <Layout.Section>{banner}</Layout.Section>
          <Layout.Section>{info}</Layout.Section>
          <Layout.Section>{button}</Layout.Section>
        </>
      )}
    </Layout>
  );
};
