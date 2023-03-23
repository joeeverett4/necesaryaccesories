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
import { Home } from "../components";

export default function HomePage() {
  return (
    <Page 
    fullWidth
    divider = {false}
    >
      <TitleBar title="App Magic : Accessories" primaryAction={null} />
      <Layout>
        <Layout.Section>
         <Home />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
