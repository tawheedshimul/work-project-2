import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';

const Stocking = ({ products }) => {
    const getInitialOpeningStockValues = () => {
        const storedValues = JSON.parse(localStorage.getItem('openingStockValues')) || [];
        return products.map((category, categoryIndex) =>
            category.data.map((product, dataIndex) => ({
                value: storedValues[categoryIndex]?.[dataIndex]?.value || product.openingStock || 0,
                id: `${category.category}-${product.name}`,
            }))
        );
    };

    const [openingStockValues, setOpeningStockValues] = useState(getInitialOpeningStockValues);

    useEffect(() => {
        localStorage.setItem('openingStockValues', JSON.stringify(openingStockValues));
    }, [openingStockValues]);

    const handleOpeningStockChange = (id, value) => {
        const newOpeningStockValues = openingStockValues.map(category =>
            category.map(product => (product.id === id ? { ...product, value } : product))
        );
        setOpeningStockValues(newOpeningStockValues);
    };

    if (!products || !Array.isArray(products) || products.length === 0) {
        return <div>No products available</div>;
    }

    return (
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
                                <th className="border-b">Opening Stock</th>
                                <th className="border-b">Opening Stock NET VALUE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category.data &&
                                Array.isArray(category.data) &&
                                category.data.map((product, dataIndex) => {
                                    const id = `${category.category}-${product.name}`;
                                    return (
                                        <tr key={dataIndex} className="text-center">
                                            <td className="border">{product.name}</td>
                                            <td className="border">{product.size}</td>
                                            <td className="border">{product.yield}</td>
                                            <td className="border">{`£${product.netPrice}`}</td>
                                            <td className="border">{`£${product.unitPrice}`}</td>
                                            <td className="border">
                                                <input
                                                    type="number"
                                                    value={openingStockValues[categoryIndex][dataIndex].value}
                                                    onChange={(e) =>
                                                        handleOpeningStockChange(id, e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="border">
                                                <NumericFormat
                                                    value={
                                                        openingStockValues[categoryIndex][dataIndex].value *
                                                            product.unitPrice ||
                                                        0
                                                    }
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix={'£'}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default Stocking;
