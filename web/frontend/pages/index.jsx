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
import { Chart } from "../components";

export default function HomePage() {
  const primaryAction = {content: 'Installation instructions', url: '/installation'};
  return (
    <Page 
    fullWidth
    divider = {false}
    >
      <TitleBar title="App Magic : Accessories" primaryAction={primaryAction} />
      <Layout>
        <Layout.Section>
         <Home />
         <Chart />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
