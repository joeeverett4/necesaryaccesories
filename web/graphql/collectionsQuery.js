

const collectionsQuery = `query {
    collections(first: 100) {
      edges {
        node {
          id
          title
          handle
          image{url}
          productsCount
          ruleSet{
            rules{
                column
                relation
                condition
            }
          }
        }
      }
    }
  }`

  export default collectionsQuery