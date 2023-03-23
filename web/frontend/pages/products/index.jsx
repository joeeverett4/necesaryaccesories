import {
    Card,
    Page,
    Layout,
    TextContainer,
    Image,
    Stack,
    Link,
    Heading,
  } from "@shopify/polaris";
  import { TitleBar } from "@shopify/app-bridge-react";
  import { Productlistmain } from "../../components";
  
  export default function index() {
    return (
      <Page 
      fullWidth
      divider = {false}
      >
        <TitleBar title="Product Accesories" primaryAction={null} />
        <Layout>
          <Layout.Section>
            <Productlistmain />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }