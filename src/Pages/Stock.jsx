import React from 'react';
import { NumericFormat } from 'react-number-format';

const Stocking = ({ products }) => {
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
                                
                            </tr>
                        </thead>
                        <tbody>
                            {category.data && Array.isArray(category.data) && category.data.map((product, dataIndex) => (
                                <tr key={dataIndex} className="text-center">
                                    <td className="border">{product.name}</td>
                                    <td className="border">{product.size}</td>
                                    {/* Display the specific data needed */}
                                    <td className="border">{product.yield}</td>
                                    <td className="border">{`£${product.netPrice}`}</td>
                                    <td className="border">{`£${product.unitPrice}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default Stocking;
