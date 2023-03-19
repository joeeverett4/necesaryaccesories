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
  SkeletonBodyText,
  SkeletonThumbnail,
  SkeletonDisplayText
} from "@shopify/polaris";
import { useNavigate } from "@shopify/app-bridge-react";
import { useState, useEffect, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";

export function Productlistmain() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading]  = useState(true);
  const [nextUrl, setNextUrl] = useState(
    ""
  );
  const fetch = useAuthenticatedFetch();
  const productsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    console.log("USEEFFECTs");
    fetch("/api/product/count")
      .then((response) => response.text())
      .then((totalCount) => {
        // Calculate the total number of pages
        const Pages = Math.ceil(totalCount / productsPerPage);
        setTotalPages(Pages);
      });
      if(nextUrl == ""){
        console.log("FIRSTPRODUCTS")
      fetch(`/api/firstproducts`)
      .then((response) => {
        return response.json();
      })
      .then((products) => {
        const getNodesFromConnections = (connections) => {
          if (!connections) return [];
          return products.edges.map(({ node }) => node);
        };
        let costa = getNodesFromConnections(products);

        setProducts(costa);
        setIsLoading(false)
        console.log(products.pageInfo)
        setNextUrl(products.pageInfo.endCursor);
        
      });
    }
    else{  
    // Fetch the products for the current page
    fetch(`/api/products/${nextUrl}`)
      .then((response) => {
        return response.json();
      })
      .then((products) => {
        const getNodesFromConnections = (connections) => {
          if (!connections) return [];
          return products.edges.map(({ node }) => node);
        };
        let costa = getNodesFromConnections(products);

        setProducts(costa);
        console.log(products.pageInfo)
        setNextUrl(products.pageInfo.endCursor);
        window.scrollTo(0, 0);
      });
    }
  }, [currentPage]);

  const loadingMarkup = isLoading ? (
    <>
    <SkeletonBodyText />
    </>
  ) : null;

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState();
  const [queryValue, setQueryValue] = useState(null);
  

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
 

  const setNewProductsFromSearch = (value) => {
    console.log("setNewProducts");
    setQueryValue(value);
    console.log(queryValue);
    if (queryValue.length >= 3) {
      console.log("yo");
      fetch(`/api/quieries/${queryValue}`)
        .then((response) => {
          return response.json();
        })
        .then((products) => {
          const getNodesFromConnections = (connections) => {
            if (!connections) return [];
            return products.edges.map(({ node }) => node);
          };
          let costa = getNodesFromConnections(products);

          setProducts(costa);
          
        });
    }
  };


  const filters = [
   
  ];

  


  const rowMarkup = !isLoading ? products.map(
    ({ id, title, images, vendor, variants }, index) => (
      
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Thumbnail source={images?.edges[0]?.node?.originalSrc} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Link
            dataPrimaryLink
            url={`/products/${id}`}
            onClick={() => navigate(`/products/${id.split("/").pop()}`)}
          >
            {title}
          </Link>
        </IndexTable.Cell>
        <IndexTable.Cell>{vendor}</IndexTable.Cell>
        <IndexTable.Cell>{variants?.nodes[0]?.price}</IndexTable.Cell>
        <IndexTable.Cell>{"testthree"}</IndexTable.Cell>
      </IndexTable.Row>
      
    ) 
  ) : null ;

  return (
    <Card>
      <div style={{ padding: "16px", display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Filters
            queryValue={queryValue}
            filters={filters}
            onQueryChange={setNewProductsFromSearch}
          />
        </div>
        
      </div>
      <IndexTable
        itemCount={products.length}
        onSelectionChange={handleSelectionChange}
        hasMoreItems
        emptyState = {loadingMarkup}
        selectable={false}
        lastColumnSticky
        headings={[
          { title: "" },
          { title: "Products" },
          {
            id: "vendor",
            title: "Vendor",
          },
          {
            id: "type",
            title: "Type",
          },
          {
            id: "test",
            title: "Test",
          },
        ]}
      >
        {rowMarkup}
        {loadingMarkup}
      </IndexTable>
      <Pagination
        hasNext={true}
        hasPrevious={true}
        onNext={() => handlePageChange(currentPage + 1)}
        onPrevious={() => handlePageChange(currentPage - 1)}
      />
    </Card>
  );

}
