import { useEffect, useState } from 'react';
import { ResourceList, TextStyle, Pagination } from '@shopify/polaris';
import { useAuthenticatedFetch } from "../hooks";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetch = useAuthenticatedFetch();
  const productsPerPage = 10;

  useEffect(() => {
    // Fetch the total number of products
    fetch('/api/products/count')
      .then(response => response.text())
      .then(totalCount => {
        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCount / productsPerPage);
        setTotalPages(totalPages);
      });

    // Fetch the products for the current page
    fetch(`/api/products?page=${currentPage}&limit=${productsPerPage}`)
      .then(response => response.json())
      .then(products => {
        setProducts(products);
      });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <ResourceList
        resourceName={{singular: 'product', plural: 'products'}}
        items={products}
        renderItem={(product) => {
          const { title, price } = product;

          return (
            <ResourceList.Item
              id={product.id}
              accessibilityLabel={`View details for ${title}`}
              url={`/products/${product.id}`}
            >
              <h3>
                <TextStyle variation="strong">{title}</TextStyle>
              </h3>
              <div>{price}</div>
            </ResourceList.Item>
          );
        }}
      />

      <Pagination
        hasNext={currentPage < totalPages}
        hasPrevious={currentPage > 1}
        onNext={() => handlePageChange(currentPage + 1)}
        onPrevious={() => handlePageChange(currentPage - 1)}
      />
    </>
  );
}
