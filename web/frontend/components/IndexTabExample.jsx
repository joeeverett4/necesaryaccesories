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

export function IndexTableWithAllElementsExample() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextUrl, setNextUrl] = useState(
    "eyJsYXN0X2lkIjo3NDUyNzQ0NDUwMjM5LCJsYXN0X3ZhbHVlIjoiNzQ1Mjc0NDQ1MDIzOSJ9"
  );
  const fetch = useAuthenticatedFetch();
  const productsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    console.log("USEEFFECT");
    fetch("/api/product/count")
      .then((response) => response.text())
      .then((totalCount) => {
        // Calculate the total number of pages
        const Pages = Math.ceil(totalCount / productsPerPage);
        setTotalPages(Pages);
      });

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
        setNextUrl(products.pageInfo.endCursor);
        window.scrollTo(0, 0);
      });
  }, [currentPage]);

  const customers = [
    {
      id: "3417",
      url: "#",
      name: "Mae Jemison",
      location: "Decatur, USA",
      orders: 20,
      amountSpent: "$2,400",
    },
    {
      id: "2567",
      url: "#",
      name: "Ellen Ochoa",
      location: "Los Angeles, USA",
      orders: 30,
      amountSpent: "$140",
    },
  ];
  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);
  const [taggedWith, setTaggedWith] = useState("VIP");
  const [queryValue, setQueryValue] = useState(null);
  const [sortValue, setSortValue] = useState("today");

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);
  const handleSortChange = useCallback((value) => setSortValue(value), []);

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

  const promotedBulkActions = [
    {
      content: "Edit customers",
      onAction: () => console.log("Todo: implement bulk edit"),
    },
  ];
  const bulkActions = [
    {
      content: "Add tags",
      onAction: () => console.log("Todo: implement bulk add tags"),
    },
    {
      content: "Remove tags",
      onAction: () => console.log("Todo: implement bulk remove tags"),
    },
    {
      content: "Delete customers",
      onAction: () => console.log("Todo: implement bulk delete"),
    },
  ];

  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
          key: "taggedWith",
          label: disambiguateLabel("taggedWith", taggedWith),
          onRemove: handleTaggedWithRemove,
        },
      ]
    : [];

  const sortOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "lastWeek" },
  ];

  const rowMarkup = products.map(
    ({ id, title, images, vendor, variants }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Thumbnail source={images.edges[0].node.originalSrc} />
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
        <IndexTable.Cell>{variants.nodes[0].price}</IndexTable.Cell>
        <IndexTable.Cell>{"testthree"}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Card>
      <div style={{ padding: "16px", display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Filters
            queryValue={queryValue}
            filters={filters}
            appliedFilters={appliedFilters}
            onQueryChange={setNewProductsFromSearch}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleClearAll}
          />
        </div>
        <div style={{ paddingLeft: "0.25rem" }}>
          <Select
            labelInline
            label="Sort by"
            options={sortOptions}
            value={sortValue}
            onChange={handleSortChange}
          />
        </div>
      </div>
      <IndexTable
        resourceName={resourceName}
        itemCount={products.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        hasMoreItems
        bulkActions={bulkActions}
        promotedBulkActions={promotedBulkActions}
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
      </IndexTable>
      <Pagination
        hasNext={true}
        hasPrevious={currentPage > 1}
        onNext={() => handlePageChange(currentPage + 1)}
        onPrevious={() => handlePageChange(currentPage - 1)}
      />
    </Card>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case "taggedWith":
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
