import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';

const Stock = ({ products, valueType, localStorageKey }) => {
    const getInitialValues = () => {
        const storedValues = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        return products.map((category, categoryIndex) =>
            category.data.map((product, dataIndex) => ({
                value: storedValues[categoryIndex]?.[dataIndex]?.value || product[valueType] || 0,
                id: `${category.category}-${product.name}`,
            }))
        );
    };

    const [values, setValues] = useState(getInitialValues);

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(values));
    }, [values, localStorageKey]);

    const handleValueChange = (id, value) => {
        const newValues = values.map(category =>
            category.map(product => (product.id === id ? { ...product, value } : product))
        );
        setValues(newValues);
    };

    if (!products || !Array.isArray(products) || products.length === 0) {
        return <div>No products available</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {products.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8 bg-white border border-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <h2 className="font-bold text-2xl text-center p-2 border bg-gray-200 text-gray-800">{category.category}</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border-b p-2">Name</th>
                                <th className="border-b p-2">Size</th>
                                <th className="border-b p-2">Yield</th>
                                <th className="border-b p-2">Net Price (£)</th>
                                <th className="border-b p-2">Unit Price (£)</th>
                                <th className="border-b p-2">{valueType}</th>
                                <th className="border-b p-2">{`${valueType} NET VALUE`}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category.data &&
                                Array.isArray(category.data) &&
                                category.data.map((product, dataIndex) => {
                                    const id = `${category.category}-${product.name}`;
                                    return (
                                        <tr key={dataIndex} className="text-center hover:bg-lime-100 transition">
                                            <td className="border p-2">{product.name}</td>
                                            <td className="border p-2">{product.size}</td>
                                            <td className="border p-2">{product.yield}</td>
                                            <td className="border p-2">{`£${product.netPrice}`}</td>
                                            <td className="border p-2">{`£${product.unitPrice}`}</td>
                                            <td className="border p-2">
                                                <input
                                                    type="number"
                                                    value={values[categoryIndex][dataIndex].value}
                                                    onChange={(e) => handleValueChange(id, e.target.value)}
                                                    className="p-1 border rounded-md text-center"
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <NumericFormat
                                                    value={values[categoryIndex][dataIndex].value * product.unitPrice || 0}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix={'£'}
                                                    className="p-1 border rounded-md text-center"
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

export default Stock;
