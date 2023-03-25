const nextpageQuery = `query {
    products(first: 25, after: "${cursor}", sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
          vendor
          images(first: 1) {
            edges {
              node {
                originalSrc
              }
            }
          }
          variants(first: 1) {
            nodes {
              price
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }`;
  export default nextpageQuery;