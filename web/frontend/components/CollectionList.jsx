import {
    IndexTable,
    Card,
    Link,
    SkeletonBodyText
  } from "@shopify/polaris";
  import { useNavigate } from "@shopify/app-bridge-react";
  import { useState, useEffect } from "react";
  import { useAuthenticatedFetch } from "../hooks";
  
  export function Collectionlistmain() {

    const [collections, setCollections] = useState([]);
    
    const [isLoading, setIsLoading]  = useState(true);
    const fetch = useAuthenticatedFetch();
   
  
    const navigate = useNavigate();
  
    useEffect(() => {
      console.log("USEEFFECTs");

      fetch("/api/collections")  
      .then((response) => {
        return response.json();
      })
      .then((collections) => {
        const getNodesFromConnections = (connections) => {
          if (!connections) return [];
          return collections.edges.map(({ node }) => node);
        };
       let costa = getNodesFromConnections(collections);
       setCollections(costa)
       setIsLoading(false)
    })
       
    }, []);
  
 
    const loadingMarkup = isLoading ? (
      <>
      <SkeletonBodyText />
      </>
    ) : null;
      
   
  

    const rowMarkup =  !isLoading ? collections.map(
      ({ id, title, images, vendor }, index) => (
        
        <IndexTable.Row
          id={id}
          key={id}
          position={index}
        >
       
          <IndexTable.Cell>
            <Link
              monochrome
              url={`/collection/${id}`}
              onClick={() => navigate(`/collection/${id.split("/").pop()}`)}
            >
              {title}
            </Link>
          </IndexTable.Cell>
        
        </IndexTable.Row>
        
      )
    ) : null ;
  
    return (
      <Card>
       
        <IndexTable
      
          itemCount={collections.length}
          selectable={false}
          lastColumnSticky
          emptyState = {loadingMarkup}
          headings={[
            { title: "Collection name" },
            
         
          ]}
        >
          {loadingMarkup}
          {rowMarkup}
        </IndexTable>
       
      </Card>
    );
  
    
  }