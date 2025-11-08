import React, { useEffect, useState } from 'react';
import ForgeReconciler, { DynamicTable } from '@forge/react';
import { requestConfluence } from '@forge/bridge';

const App = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const getPages = async () => {
      try {
        const response = await requestConfluence('/wiki/rest/api/content/search?cql=type=page&expand=space,history.lastUpdated');
        if (response.status === 200) {
          const data = await response.json();
          setPages(data.results);
        }
      } catch (error) {
        console.log('Error fetching pages:', error);
      }
    };

    getPages();
  }, []);

  const head = {
    cells: [
      {
        key: 'space',
        content: 'Space Name',
        isSortable: false
      },
      {
        key: 'title',
        content: 'Page Title',
        isSortable: false
      },
      {
        key: 'lastModified', 
        content: 'Last Modified',
        isSortable: false
      }
    ]
  };

  const rows = pages.map(page => ({
    key: page.id,
    cells: [
      {
        key: 'space',
        content: page.space.name
      },
      {
        key: 'title',
        content: page.title
      },
      {
        key: 'lastModified',
        content: page.history.lastUpdated.when
      }
    ]
  }));

  return <DynamicTable head={head} rows={rows} />;
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);