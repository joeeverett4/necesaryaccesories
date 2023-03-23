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
  import { Installation } from "../components";
  
  export default function InstallationPage() {

 

    return (
      <Page 
      fullWidth
      divider = {false}
      >
        <TitleBar title="Installation instructions" primaryAction={null} />
        <Layout>
          <Layout.Section>
           <Installation />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  