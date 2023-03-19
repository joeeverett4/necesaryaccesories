import {
    TextField,
    IndexTable,
    Card,
    Filters,
    Select,
    useIndexResourceState,
    Pagination,
    Thumbnail,
    Link,
  } from "@shopify/polaris";
  import { useNavigate } from "@shopify/app-bridge-react";
  import { useState, useEffect, useCallback } from "react";
  import { useAuthenticatedFetch } from "../hooks";
  
  export function Collectionlistmain() {
    const [collections, setCollections] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextUrl, setNextUrl] = useState(
      ""
    );
    const fetch = useAuthenticatedFetch();
    const productsPerPage = 10;
  
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
    })

      fetch("/api/product/count")
        .then((response) => response.text())
        .then((totalCount) => {
          // Calculate the total number of pages
          const Pages = Math.ceil(totalCount / productsPerPage);
          setTotalPages(Pages);
        });
       
    }, [currentPage]);
  
 

      
   
  

    const rowMarkup = collections.map(
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
    );
  
    return (
      <Card>
       
        <IndexTable
      
          itemCount={collections.length}
          selectable={false}
          lastColumnSticky
          headings={[
            { title: "Collection name" },
            
         
          ]}
        >
          {rowMarkup}
        </IndexTable>
       
      </Card>
    );
  
    
  }