import React, { useState } from 'react';

const Stocking = ({ products }) => {
  const [netPriceChanged, setNetPriceChanged] = useState({});
  const [deliveryColumns, setDeliveryColumns] = useState([]);
  const [notes, setNotes] = useState({});

  const handleAddDeliveryColumn = () => {
    setDeliveryColumns([...deliveryColumns, { label: `Delivery ${deliveryColumns.length + 1}`, netPrice: 0, deliveryTotal: 0, deliveryStockTotalNetValue: 0 }]);
  };

  const handleNetPriceChange = (columnIndex) => {
    const newNetPrice = parseFloat(prompt('Enter the new Net Price:')) || 0;

    setNetPriceChanged({
      ...netPriceChanged,
      [`delivery-${columnIndex}`]: true,
    });

    setDeliveryColumns((prevColumns) =>
      prevColumns.map((column, index) =>
        index === columnIndex ? { ...column, netPrice: newNetPrice } : column
      )
    );

    setNotes((prevNotes) => ({
      ...prevNotes,
      [`delivery-${columnIndex}`]: `Net Price changed to £${newNetPrice.toFixed(2)}`
    }));
  };

  const handleDeliveryChange = (productIndex, columnIndex, value) => {
    setDeliveryColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const deliveryValue = parseFloat(value) || 0;
      newColumns[columnIndex].deliveryTotal = newColumns.reduce(
        (sum, column) => sum + (parseFloat(column.deliveryTotal) || 0),
        deliveryValue
      );
      return newColumns;
    });
  };

  const handleDeliveryStockChange = (productIndex, columnIndex, value) => {
    setDeliveryColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const deliveryStockValue = parseFloat(value) || 0;
      newColumns[columnIndex].deliveryStockTotalNetValue = newColumns.reduce(
        (sum, column) => sum + (parseFloat(column.deliveryStockTotalNetValue) || 0),
        deliveryStockValue * newColumns[columnIndex].netPrice
      );
      return newColumns;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={handleAddDeliveryColumn}>Add Delivery Column</button>
      {products?.map((category, categoryIndex) => (
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
                {deliveryColumns.map((column, columnIndex) => (
                  <React.Fragment key={`header-${columnIndex}`}>
                    <th className="border-b">{column.label}</th>
                    <th className="border-b">{`Net Value ${column.label}`}</th>
                  </React.Fragment>
                ))}
                <th className="border-b">Delivery TOTALS</th>
                <th className="border-b">Delivery Stock Total NET VALUE</th>
              </tr>
            </thead>
            <tbody>
              {category.data?.map((product, dataIndex) => {
                const deliveryColumnsContent = deliveryColumns.map((column, columnIndex) => {
                  const deliveryValue = parseFloat(product[`delivery${columnIndex + 1}`]) || 0;
                  const netValue = deliveryValue * column.netPrice;

                  return (
                    <React.Fragment key={`data-${columnIndex}`}>
                      <td
                        className="border"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleDeliveryChange(dataIndex, columnIndex, e.target.textContent)}
                      >
                        {deliveryValue}
                      </td>
                      <td className="border">{`£${netValue.toFixed(2)}`}</td>
                    </React.Fragment>
                  );
                });

                return (
                  <tr key={dataIndex} className="text-center">
                    <td className="border">{product.name}</td>
                    <td className="border">{product.size}</td>
                    <td className="border">{product.yield}</td>
                    <td className="border">{`£${product.netPrice}`}</td>
                    <td className="border">{`£${product.unitPrice}`}</td>
                    {deliveryColumnsContent}
                    <td className="border">{`£${deliveryColumns.reduce((sum, col) => sum + col.deliveryTotal, 0).toFixed(2)}`}</td>
                    <td className="border">{`£${deliveryColumns.reduce((sum, col) => sum + col.deliveryStockTotalNetValue, 0).toFixed(2)}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      <div>
        <h3>Notes</h3>
        <ul>
          {Object.entries(notes).map(([key, note]) => (
            <li key={key}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Stocking;
