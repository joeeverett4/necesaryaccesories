import { useEffect, useState, useCallback } from 'react';

import { useAuthenticatedFetch } from "../hooks";
import { ResourcePicker, Toast } from '@shopify/app-bridge-react';
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  Button,
  TextStyle,
  Layout,
  Thumbnail,
  SkeletonBodyText,
  SkeletonDisplayText
  
} from "@shopify/polaris";
import "../assets/style.css"

export function Collection() {
  
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(false);
  const [parentCollection, setParentCollection] = useState(null)
  const fetch = useAuthenticatedFetch();
  const [resourcePickerOpen, setResourcePickerOpen] = useState(false);
  const lastPart = window.location.href.split('/').pop();

  const toggleActive = useCallback(() => setActive((active) => !active), []);


  const toastMarkup = active ? (
    <Toast content="Accesories Saves" onDismiss={toggleActive} />
  ) : null;

  useEffect(() => {
     
    fetch(`/api/collection/${lastPart}`)
      .then(response => response.json())
      .then(collection => {
       setParentCollection(collection)
      });

      fetch(`/api/products/db/${lastPart}`)
      .then(response => response.json())
      .then(products => {
        setProducts(products);
       //console.log(products)
      });
      
    },[])

    const handleSelectionChange = (resources) => {
      const ids = resources.selection.map((product) => product.id);
    
      fetch(`/api/collection/meta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: ids,
          id: lastPart,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          fetch(`/api/products/db/${lastPart}`, { method: 'DELETE' })
            .then((response) => {
              
              // Once the products are deleted, create the new ones
              resources.selection.map((product, index) => {
                
                fetch(`/api/products/db`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    title: product.title,
                    product_id: lastPart,
                    description: product.descriptionHtml,
                    image: product.images[0].originalSrc,
                    sequence: index,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    
                    toggleActive();
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              });
            })
            .catch((error) => {
              console.error(error);
            });
          toggleActive();
        })
        .catch((error) => {
          console.error(error);
        });
      
      setProducts(resources.selection);
      setResourcePickerOpen(false);
    };

    const handleDeleteProducts = () => {
      console.log("handleDeletedProducts")

      fetch(`/api/products/remove`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         id: lastPart,
       }),
     })
       .then((res) => res.json())
       .then((data) => {
         fetch(`/api/products/db/${lastPart}`, { method: 'DELETE' })
           .then((response) => {
             setProducts([]);
            })
           .catch((error) => {
             console.error(error);
           });
       
       })
       .catch((error) => {
         console.error(error);
       });
     
    }



  

  return (
    <>
    {parentCollection ? (
      <>
     <Layout>
      <Layout.Section oneHalf>
    <Card
        title= {parentCollection.title}
        sectioned
        secondaryFooterActions={[{content: 'Delete Accessories', destructive : true, onAction: () => handleDeleteProducts(),}]}
        primaryFooterAction={{
          content: "Select Accessories",
          onAction: () => setResourcePickerOpen(true),
        }}
      >
       
      </Card>
      </Layout.Section>
      <Layout.Section oneHalf>
      </Layout.Section>
      </Layout>
    <div class = "row">
    
     { products.length > 0 ? ( 
     products.map((product, i) => (
       
        <div className="product-container" key={i}>
          { products[0].hasOwnProperty('product_id') ? (
          <>
          <img src={product.image} />
          <p className="product-title">
            {product.title}
          </p>
          </>
          ) : ( 
            <>
            <img src={product?.images[0].originalSrc} />
            <p className="product-title">
              {product.title}
            </p>
            <p>£ {product.variants[0].price}</p>
            </>
          ) }
        </div>
        
      ))
     ) : (
     <p>No products</p>
     )}
    </div>
      <ResourcePicker
        resourceType="Product"
        open={resourcePickerOpen}
        onSelection={handleSelectionChange}
        onCancel={() => setResourcePickerOpen(false)}
        allowMultiple
        showVariants = {false}
      />
      
      {toastMarkup}
      </>
    ) : (
        <Layout>
        <Layout.Section oneHalf>
      <Card
          title= {<SkeletonDisplayText />}
          sectioned
        >
          <TextContainer spacing="loose">
          <SkeletonBodyText />
          </TextContainer>
        </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
        </Layout.Section>
        </Layout>
      )
}
    </>
  );
}