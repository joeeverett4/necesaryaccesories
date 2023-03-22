
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
import { Collection } from "../../../components";

export default function index() {
  return (
    <Page 
    fullWidth
    breadcrumbs={[{content: 'Products', url: '/Collection'}]}
    >
    
    <Layout>
     
      <Layout.Section>
       <Collection /> 
      </Layout.Section>
    </Layout>
  </Page>
  )
}