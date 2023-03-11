import {
    TextField,
    Filters,
    Button,
    Card,
    ResourceList,
    Avatar,
    ResourceItem,
    Pagination
  } from '@shopify/polaris';
  import {useEffect, useState, useCallback} from 'react';
  import { useAuthenticatedFetch } from "../hooks";
  
  export function ResourceListFiltersExample() {


    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const fetch = useAuthenticatedFetch();
    const productsPerPage = 10;
  

    useEffect(() => {
       
        fetch('/api/product/count')
        .then(response => response.text())
        .then(totalCount => {
          // Calculate the total number of pages
          const Pages = Math.ceil(totalCount / productsPerPage);
          setTotalPages(Pages);
        });
  

        // Fetch the products for the current page
        fetch(`/api/products?limit=${productsPerPage}`)
        .then(response => {
            console.log(response.headers.get('Link'));
            return response.json();
          })
          .then(products => {
            
            setProducts(products);
          });
          console.log(currentPage)
          console.log(products)
      }, [currentPage]);


    const [taggedWith, setTaggedWith] = useState('VIP');
    const [queryValue, setQueryValue] = useState(null);
  
    const handleTaggedWithChange = useCallback(
      (value) => setTaggedWith(value),
      [],
    );
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleClearAll = useCallback(() => {
      handleTaggedWithRemove();
      handleQueryValueRemove();
    }, [handleQueryValueRemove, handleTaggedWithRemove]);

    const isEmpty = (value) => {
        if (Array.isArray(value)) {
          return value.length === 0;
        } else {
          return value === '' || value == null;
        }
      };

      function disambiguateLabel(key, value) {
        switch (key) {
          case 'taggedWith1':
            return `Tagged with ${value}`;
          default:
            return value;
        }
      }
  
    const resourceName = {
      singular: 'customer',
      plural: 'customers',
    };
  
    const allItems = [
      {
        id: 108,
        url: '#',
        name: 'Mae Jemison',
        location: 'Decatur, USA',
      },
      {
        id: 208,
        url: '#',
        name: 'Ellen Ochoa',
        location: 'Los Angeles, USA',
      },
    ];
  
    const [items, setItems] = useState(allItems);
  
    const filters = [
      {
        key: 'taggedWith1',
        label: 'Tagged with',
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
            key: 'taggedWith1',
            label: disambiguateLabel('taggedWith1', taggedWith),
            onRemove: handleTaggedWithRemove,
          },
        ]
      : [];
  
    const filterControl = (
      <Filters
        queryValue={queryValue}
        filters={filters}
        appliedFilters={appliedFilters}
        onQueryChange={handleQueryValueChange}
        onQueryClear={handleQueryValueRemove}
        onClearAll={handleClearAll}
      >
        <div style={{paddingLeft: '8px'}}>
          <Button onClick={() => console.log('New filter saved')}>Save</Button>
        </div>
      </Filters>
    );
  
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };

    function handleQueryValueChange(query) {
      setQueryValue(query);
      const lowercaseQuery = query.toLowerCase();
      const filteredItems = allItems.filter(
        (item) => item.name.toLowerCase().indexOf(lowercaseQuery) !== -1,
      );
      setItems(filteredItems);
    }
  
    return (
      <Card>
        <ResourceList
          resourceName={resourceName}
          items={products}
          renderItem={renderItem}
          filterControl={filterControl}
        />
        <Pagination
        hasNext={true}
        hasPrevious={currentPage > 1}
        onNext={() => handlePageChange(currentPage + 1)}
        onPrevious={() => handlePageChange(currentPage - 1)}
      />
      </Card>

    );
  
    function renderItem(item) {
        const {id, title } = item;
        const media = <Avatar customer size="medium" name={title} />;
      
        // Filter out items that don't match the search query
        if (queryValue && !title.toLowerCase().includes(queryValue.toLowerCase())) {
          return null;
        }
      
        return (
          <ResourceItem id={id} media={media}>
            
              {title}
            
          </ResourceItem>
        );
      }

      

    }