import {
  IndexTable,
  Card,
  Filters,
  useIndexResourceState,
  Pagination,
  Thumbnail,
  Link,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonThumbnail,
  Stack,
  Heading,
  Icon,
  Spinner
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { useNavigate } from "@shopify/app-bridge-react";
import { useState, useEffect, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";
import "../assets/style.css"

export function Productlistmain() {
  const [products, setProducts] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState("");
  const fetch = useAuthenticatedFetch();
  const productsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    console.log("USEEFFECTs");
    if (nextUrl == "") {
      console.log("FIRSTPRODUCTS");
      fetch("/api/firstproducts")
        .then((response) => {
          return response.json();
        })
        .then((products) => {
          const getNodesFromConnections = (connections) => {
            if (!connections) return [];
            return products.edges.map(({ node }) => node);
          };
          let costa = getNodesFromConnections(products);

          // Wait for all API calls to resolve
          Promise.all(
            costa.map((c) =>
              fetch(`/api/accessories/${c.id.split("/").pop()}`)
                .then((response) => response.json())
                .then((imgs) => {
                  const destructuredimgs = imgs.map(
                    (obj) => obj[Object.keys(obj)[0]]
                  );
                  return { ...c, imgs: destructuredimgs };
                })
            )
          ).then((updatedCosta) => {
            console.log(updatedCosta);
            setProducts(updatedCosta);
            setIsLoading(false);
            console.log(products.pageInfo);
            setNextUrl(products.pageInfo.endCursor);
          });
        });
    } else {
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

        // Wait for all API calls to resolve
        Promise.all(
          costa.map((c) =>
            fetch(`/api/accessories/${c.id.split("/").pop()}`)
              .then((response) => response.json())
              .then((imgs) => {
                const destructuredimgs = imgs.map(
                  (obj) => obj[Object.keys(obj)[0]]
                );
                return { ...c, imgs: destructuredimgs };
              })
          )
        ).then((updatedCosta) => {
          console.log(updatedCosta);
          setProducts(updatedCosta);
          setIsLoading(false);
          console.log(products.pageInfo);
          setNextUrl(products.pageInfo.endCursor);
          window.scrollTo(0, 0);
        });
          
        });
    }
  }, [currentPage]);

  const loadingMarkup = isLoading ? (
    <>
  <IndexTable.Row>
   <IndexTable.Cell className = "w-10" >  
  <SkeletonThumbnail />
</IndexTable.Cell>
<IndexTable.Cell className = "w-70" >
  <SkeletonBodyText />
</IndexTable.Cell>  
<IndexTable.Cell className = "w-20" >  
<Stack>
<SkeletonThumbnail />
<SkeletonThumbnail />
</Stack>
</IndexTable.Cell>  
</IndexTable.Row>
<IndexTable.Row>
   <IndexTable.Cell className = "w-10" >  
  <SkeletonThumbnail />
</IndexTable.Cell>
<IndexTable.Cell className = "w-70" >
  <SkeletonBodyText />
</IndexTable.Cell>  
<IndexTable.Cell className = "w-20" >  
<Stack>
<SkeletonThumbnail />
<SkeletonThumbnail />
</Stack>
</IndexTable.Cell>  
</IndexTable.Row>
   <IndexTable.Row>
   <IndexTable.Cell className = "w-10" >  
  <SkeletonThumbnail />
</IndexTable.Cell>
<IndexTable.Cell className = "w-70" >
  <SkeletonBodyText />
</IndexTable.Cell>  
<IndexTable.Cell className = "w-20" >  
<Stack>
<SkeletonThumbnail />
<SkeletonThumbnail />
</Stack>
</IndexTable.Cell>  
</IndexTable.Row>
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
          setIsLoading(true);
          const getNodesFromConnections = (connections) => {
            if (!connections) return [];
            return products.edges.map(({ node }) => node);
          };
          let costa = getNodesFromConnections(products);

           // Wait for all API calls to resolve
        Promise.all(
          costa.map((c) =>
            fetch(`/api/accessories/${c.id.split("/").pop()}`)
              .then((response) => response.json())
              .then((imgs) => {
                const destructuredimgs = imgs.map(
                  (obj) => obj[Object.keys(obj)[0]]
                );
                return { ...c, imgs: destructuredimgs };
              })
          )
        ).then((updatedCosta) => {
          console.log(updatedCosta);
          setProducts(updatedCosta);
          setIsLoading(false)
          
        });

        
        });
    }
  };

  const filters = [];

  const rowMarkup = !isLoading
    ? products.map(({ id, title, images, vendor, variants, imgs }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            {images?.edges[0]?.node?.originalSrc ? (
              <Thumbnail source={images?.edges[0]?.node?.originalSrc} />
            ) : (
              <Thumbnail source={ImageMajor} color="base" />
            )}
          </IndexTable.Cell>
          <IndexTable.Cell>
            
            <Link
              monochrome
              removeUnderline={true}
              url={`/products/${id}`}
              onClick={() => navigate(`/products/${id.split("/").pop()}`)}
            >
              {title}
            </Link>
          
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div style = {{display:"flex"}}>
            {imgs.map((imgSrc, index) => (
              <Thumbnail key={index} source={imgSrc} />
            ))}
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      ))
    : null;

  return (
    <>
      <Card title="Choose product to add accesories to">
        <div style={{ padding: "16px", display: "flex" }}>
          <div style={{ flex: 1 }}>
            <Filters
              queryValue={queryValue}
              filters={filters}
              onQueryChange={setNewProductsFromSearch}
              queryPlaceholder="Search products"
            />
          </div>
        </div>
        <IndexTable
          itemCount={products.length}
          onSelectionChange={handleSelectionChange}
          hasMoreItems
          emptyState={<SkeletonBodyText />}
          selectable={false}
          hasZebraStriping={true}
          headings={[
            { title: "" },
            { title: "Products" },
            { title: "Accessories" },
          ]}
        >
          {rowMarkup}
          {loadingMarkup}
        </IndexTable>
        <div style={{ paddingBottom: "20px" }}>
          <Stack alignment="center" distribution="center">
            <Pagination
              hasNext={true}
              hasPrevious={true}
              onNext={() => handlePageChange(currentPage + 1)}
              onPrevious={() => handlePageChange(currentPage - 1)}
            />
          </Stack>
        </div>
      </Card>
    </>
  );
}
