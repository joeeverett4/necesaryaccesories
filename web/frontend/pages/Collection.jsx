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
  
  import { trophyImage } from "../assets";
  import { Collectionlistmain } from "../components";
  
  export default function Collection() {
    return (
      <Page fullWidth>
        <TitleBar title="necesaryaccesories" primaryAction={null} />
        <Layout>
          <Layout.Section>
            <Collectionlistmain />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }