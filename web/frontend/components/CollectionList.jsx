import {
  IndexTable,
  Card,
  Link,
  SkeletonBodyText,
  Icon,
  Thumbnail,
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
          setCollections(updatedCosta);
          setIsLoading(false);
        });
      });
  }, []);

  const loadingMarkup = isLoading ? (
    <>
      <SkeletonBodyText />
    </>
  ) : null;

  const rowMarkup = !isLoading
    ? collections.map(
        ({ id, title, image, productsCount, ruleSet, imgs }, index) => (
          <IndexTable.Row id={id} key={index} position={index}>
            <IndexTable.Cell className="w-50">
              <Link
                monochrome
                removeUnderline={true}
                url={`/collections/${id}`}
                onClick={() => navigate(`/collections/${id.split("/").pop()}`)}
              >
                {title}
              </Link>
            </IndexTable.Cell>
            <IndexTable.Cell className="w-50">
              <div style={{ display: "flex" }}>
                {imgs.length > 0 ? (
                  imgs.map((imgSrc, index) => (
                    <Thumbnail key={index} source={imgSrc} />
                  ))
                ) : (
                  <Thumbnail source={ImageMajor} color="base" />
                )}
              </div>
            </IndexTable.Cell>
          </IndexTable.Row>
        )
      )
    : null;

  return (
    <Card
    title = "Choose a collection to add accessories to"
    sectioned
    >
      <IndexTable
        itemCount={collections.length}
        selectable={false}
        lastColumnSticky={false}
        emptyState={loadingMarkup}
        headings={[{ title: "Title" }, { title: "Accesories" }]}
      >
        {loadingMarkup}
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}
