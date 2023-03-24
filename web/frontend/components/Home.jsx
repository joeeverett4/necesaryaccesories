import {
    Layout,
    Card,
    Icon,
    Stack,
    Heading,
    Subheading,
    TextContainer,
    TextField,
    Link,
    List
  } from "@shopify/polaris";
  import "../assets/style.css"
  import { useEffect, useState } from "react";
  import { useAuthenticatedFetch } from "../hooks";
  import { useNavigate } from "@shopify/app-bridge-react";
  import { CircleInformationMajor } from "@shopify/polaris-icons";

export function Home() {

  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const [numberofproductacccesories, setnumberofproductaccessories] = useState("")
  const [numberofcollectionacccesories, setnumberofcollectionaccessories] = useState("")
    useEffect(() => {
     const count = fetch("/api/accessoriescount")
     .then((response) => {
      return response.json();
    })
    .then((count) => {
      console.log(count)
       const stringifyproductcount = count.product_count.toString()
       const stringifycollectioncount = count.collection_count.toString()
      setnumberofproductaccessories(stringifyproductcount)
      setnumberofcollectionaccessories(stringifycollectioncount)
    })
    },[])
  
  
  return (
    <Layout>
      <Layout.Section primary>
        <Card title="Welcome to App Magic : Accesories" 
        sectioned
        secondaryFooterActions={[{content: 'Add Collection assigned Accesories', onAction: () => navigate("/collections")}]}
        primaryFooterAction={{content: 'Add Product assigned Accesories', onAction: () => navigate("/products")}}
        >
          <Stack spacing="loose" vertical={true}>
            <TextContainer>
            <p>Here are the Accesories you have showing on your store</p>
          
            <List type = "bullet">
              <List.Item>You have <b> {numberofproductacccesories} </b> accesories assign to individual products </List.Item>
              <List.Item>You have <b> {numberofcollectionacccesories} </b> accesories assign to collections </List.Item>
            </List>

            </TextContainer>
          </Stack>
        </Card>
      </Layout.Section>
      <Layout.Section secondary>
       <Card title = "Need some help setting up?" sectioned>
       <Stack spacing="loose" vertical={true}>
            <TextContainer>
           <p> Out team of developers will be happy to assist you, send an email to <Link url = "https://www.bbc.co.uk/sport">xzydevelopers@gmail.com</Link></p> 
           <p> Aliquam et tincidunt arcu, sit amet efficitur nisi. Duis at neque egestas, pretium lectus sit amet, fringilla ante.</p> 
             </TextContainer>
        </Stack>      
       </Card>
      </Layout.Section>
    </Layout>


  )
}
