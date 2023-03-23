import {
  IndexTable,
  Card,
  Link,
  SkeletonBodyText,
  Icon,
  Thumbnail
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { useNavigate } from "@shopify/app-bridge-react";
import { useState, useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";

export function Collectionlistmain() {
  const [collections, setCollections] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
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
        console.log(costa);
        setCollections(costa);
        setIsLoading(false);
      });
  }, []);

  const loadingMarkup = isLoading ? (
    <>
      <SkeletonBodyText />
    </>
  ) : null;

  const rowMarkup = !isLoading
    ? collections.map(({ id, title, image, productsCount, ruleSet }, index) => (
        <IndexTable.Row id={id} key={index} position={index}>
          <IndexTable.Cell>
            {image ? (
              <Thumbnail source={image.url} />
            ) : (
              <Thumbnail source={ImageMajor} color="base" />
            )}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Link
              monochrome
              removeUnderline={true}
              url={`/collections/${id}`}
              onClick={() => navigate(`/collections/${id.split("/").pop()}`)}
            >
              {title}
            </Link>
          </IndexTable.Cell>
          
          <IndexTable.Cell>{productsCount}</IndexTable.Cell>
          <IndexTable.Cell>{console.log(ruleSet)}{ruleSet?.rules[0]?.column.toLowerCase()}{" "}{ruleSet?.rules[0]?.relation.toLowerCase()}{" "}{ruleSet?.rules[0]?.condition}</IndexTable.Cell>
          <IndexTable.Cell></IndexTable.Cell>
        </IndexTable.Row>
      ))
    : null;

  return (
    <Card>
      <IndexTable
        itemCount={collections.length}
        selectable={false}
        lastColumnSticky = {false}
        emptyState={loadingMarkup}
        headings={[
          { title: "" },
          { title: "Title" },
          { title: "Products" },
          { title: "Product Condition" },
          { title: "" }
        ]
        }
      >
        {loadingMarkup}
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}
