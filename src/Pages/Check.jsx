import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Stock from './Stock';

const Check = () => {
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem('products');
    console.log('Stored products from local storage:', storedProducts);
    return storedProducts ? JSON.parse(storedProducts).categories : initialProducts.categories;
  });

  // Step 2: Fetch data from the server only if local storage is empty
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Checking local storage:', products);

        if (products.length === 0) {
          console.log('Local storage is empty. Fetching from the server...');

          // const response = await fetch('/products.json');
          // const data = await response.json();

          if (data && data.categories) {
            console.log('Data fetched from the server:', data.categories);

            setProducts(data.categories);
            localStorage.setItem('products', JSON.stringify(data.categories));
          }
        } else {
          console.log('Using data from local storage:', products);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [products]);

  // Step 3: Save data to local storage on state change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify({ categories: products }));
  }, [products]);

  // Check if products is an array before mapping over it
  if (!Array.isArray(products)) {
    console.error('Invalid data format. Current state:', products);
    return <div>Error: Invalid data format</div>;
  }


  const VAT_RATE = 1.2;

  const calculateGpNetPrice = (unitPrice, salesPriceLessVAT) => {
    return ((1 - unitPrice / salesPriceLessVAT) * 100).toFixed(2);
  };

  const handleInputChange = (categoryIndex, dataIndex, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[categoryIndex].data[dataIndex][field] = value;

    if (field === 'netPrice' || field === 'yield') {
      const unitPrice = field === 'netPrice'
        ? Number(value) / Number(updatedProducts[categoryIndex].data[dataIndex].yield)
        : Number(updatedProducts[categoryIndex].data[dataIndex].netPrice) / Number(value);

      updatedProducts[categoryIndex].data[dataIndex].unitPrice = unitPrice.toFixed(2);
    } else if (field === 'salesPriceVAT') {
      updatedProducts[categoryIndex].data[dataIndex].salesPriceLessVAT = (Number(value) / VAT_RATE).toFixed(2);
    } else {
      const unitPrice = Number(value) / Number(updatedProducts[categoryIndex].data[dataIndex][field]);
      updatedProducts[categoryIndex].data[dataIndex].unitPrice = unitPrice.toFixed(2);
    }

    updatedProducts[categoryIndex].data[dataIndex].gpNetPrice = calculateGpNetPrice(
      parseFloat(updatedProducts[categoryIndex].data[dataIndex].unitPrice),
      parseFloat(updatedProducts[categoryIndex].data[dataIndex].salesPriceLessVAT)
    );

    setProducts(updatedProducts);
  };

  const handleSizeChange = (categoryIndex, dataIndex, value) => {
    const updatedProducts = [...products];
    updatedProducts[categoryIndex].data[dataIndex].size = value;
    setProducts(updatedProducts);
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Setting</Tab>
        <Tab>Opening</Tab>
        <Tab>Closing Stock</Tab>
        <Tab>Usage Stock</Tab>
      </TabList>

      <TabPanel>
        <div className="container mx-auto p-4">
          {products.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className='font-bold text-2xl text-center p-2 border'>{category.category}</h2>
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="border-b">Name</th>
                    <th className="border-b">Size</th>
                    <th className="border-b">Yield</th>
                    <th className="border-b">Net Price (£)</th>
                    <th className="border-b">Unit Price (£)</th>
                    <th className="border-b">Sales Price with VAT (£)</th>
                    <th className="border-b">Sales Price Less VAT (£)</th>
                    <th className="border-b">GP% NET PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {category.data.map((product, dataIndex) => (
                    <tr key={dataIndex} className="text-center">
                      <td className="border">{product.name}</td>
                      <td className="border">
                        <NumericFormat
                          className="p-1 border"
                          type="number"
                          value={product.size}
                          onChange={(e) => handleInputChange(categoryIndex, dataIndex, 'size', e.target.value)}
                        />
                      </td>
                      <td className="border">
                        <NumericFormat
                          className="p-1 border"
                          type="number"
                          value={product.yield}
                          onChange={(e) => handleInputChange(categoryIndex, dataIndex, 'yield', e.target.value)}
                        />
                      </td>
                      <td className="border">
                        <NumericFormat
                          className="p-1 border"
                          type="number"
                          value={product.netPrice}
                          onChange={(e) => handleInputChange(categoryIndex, dataIndex, 'netPrice', e.target.value)}
                          decimalScale={2}
                        />
                      </td>
                      <td className="border">{`£${product.unitPrice}`}</td>
                      <td className="border">
                        <NumericFormat
                          className="p-1 border"
                          type="number"
                          value={product.salesPriceVAT}
                          onChange={(e) => handleInputChange(categoryIndex, dataIndex, 'salesPriceVAT', e.target.value)}
                          inputMode="numeric"
                          style={{ appearance: "textfield" }}
                          decimalScale={2}
                        />
                      </td>
                      <td className="border">{`£${product.salesPriceLessVAT}`}</td>
                      <td className="border">{`${product.gpNetPrice}%`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </TabPanel>
      <TabPanel>
        <Stock products={products} valueType="openingStock" localStorageKey="openingStock" />
      </TabPanel>
      <TabPanel>
        <Stock products={products} valueType="closingStoke" localStorageKey="closingStock"></Stock>
      </TabPanel>
      <TabPanel>
        <Stock products={products} valueType="usageStoke" localStorageKey="usageStock"></Stock>
      </TabPanel>
    </Tabs>
  );
};

const initialProducts = {
  categories: [
    {
      "category": "Draft-Alc",
      "data": [
        { "name": "Grolsch", "size": "50l Keg", "yield": 300, "netPrice": 150, "unitPrice": 0.5, "salesPriceVAT": 4, "salesPriceLessVAT": 3.33, "gpNetPrice": "85.00" },
        { "name": "Meantim", "size": "30L keg", "yield": 88, "netPrice": 150, "unitPrice": 1.71, "salesPriceVAT": 4, "salesPriceLessVAT": 3.33, "gpNetPrice": "49.00" },
        { "name": "Peroni", "size": "50l Keg", "yield": 88, "netPrice": 150, "unitPrice": 1.71, "salesPriceVAT": 4, "salesPriceLessVAT": 3.33, "gpNetPrice": "49.00" }
      ]
    },
    {
      "category": "Bottle",
      "data": [
        { "name": "Black Sheep", "size": "50l Keg", "yield": 300, "netPrice": 150, "unitPrice": 0.5, "salesPriceVAT": 4, "salesPriceLessVAT": 3.33, "gpNetPrice": "85.00" },
        { "name": "Meantim", "size": "30L keg", "yield": 88, "netPrice": 150, "unitPrice": 1.71, "salesPriceVAT": 4, "salesPriceLessVAT": 3.33, "gpNetPrice": "49.00" },
        { "name": "Peroni", "size": "50l Keg", "yield": 88, "netPrice": 150, "unitPrice": 1.71, "salesPriceVAT": 4, "salesPriceLessVAT": 3.33, "gpNetPrice": "49.00" }
      ]
    },
    {
      "category": "Draft-Alc",
      "data": [
        { "name": "Grolsch", "size": "50l Keg", "yield": 300, "netPrice": 150, "unitPrice": 0.5, "salesPriceVAT": 4, "salesPriceLessVAT": 3.33, "gpNetPrice": "85.00" },
        { "name": "Meantim", "size": "30L keg", "yield": 88, "netPrice": 150, "unitPrice": 1.71, "salesPriceVAT": 4, "salesPriceLessVAT": 3.33, "gpNetPrice": "49.00" },
        { "name": "Peroni", "size": "50l Keg", "yield": 88, "netPrice": 150, "unitPrice": 1.71, "salesPriceVAT": 4, "salesPriceLessVAT": 3.33, "gpNetPrice": "49.00" }
      ]
    }
  ]
};

export default Check;
