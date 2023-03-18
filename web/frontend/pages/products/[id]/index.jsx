
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
import { Product } from "../../../components";

export default function index() {
  return (
    <Page 
    fullWidth
    breadcrumbs={[{content: 'Products', url: '/'}]}
    >
    
    <Layout>
     
      <Layout.Section>
       <Product /> 
      </Layout.Section>
    </Layout>
  </Page>
  )
}
