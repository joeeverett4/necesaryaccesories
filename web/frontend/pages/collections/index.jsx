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
  import { Collectionlistmain } from "../../components";
  
  export default function index() {
    return (
      <Page narrowWidth>
        <TitleBar title="Collection Accesories" primaryAction={null} />
        <Layout>
          <Layout.Section>
            <Collectionlistmain />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }