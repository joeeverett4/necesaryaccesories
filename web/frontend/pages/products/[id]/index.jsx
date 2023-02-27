
import React from 'react'
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
import { MetafieldList, MetafieldListAlt } from "../../../components";

export default function index() {
  return (
    <Page fullWidth>
    
    <Layout>
     
      <Layout.Section>
       <MetafieldListAlt /> 
      </Layout.Section>
    </Layout>
  </Page>
  )
}
