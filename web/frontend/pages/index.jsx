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
import { PaginationExample } from "../components";
import { ProductList } from "../components";
import { ResourceListFiltersExample } from "../components";
import { IndexTableWithAllElementsExample } from "../components";

export default function HomePage() {
  return (
    <Page fullWidth>
      <TitleBar title="necesaryaccesories" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <IndexTableWithAllElementsExample />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
