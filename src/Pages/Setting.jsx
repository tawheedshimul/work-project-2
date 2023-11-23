import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';

const Setting = () => {
    const [products, setProducts] = useState([
        { name: 'Grolsch', size: '50l Keg', yield: 300, netPrice: 150, unitPrice: 0.5, salesPriceVAT: 4, salesPriceLessVAT: 3.33, gpNetPrice: '85.00' },
        { name: 'Meantim', size: '30L keg', yield: 88, netPrice: 150, unitPrice: 1.71, salesPriceVAT: 4, salesPriceLessVAT: 3.33, gpNetPrice: '49.00' },
        { name: 'Peroni', size: '50l Keg', yield: 88, netPrice: 150, unitPrice: 1.71, salesPriceVAT: 4, salesPriceLessVAT: 3.33, gpNetPrice: '49.00' },
    ]);

    const VAT_RATE = 1.2;

    const calculateGpNetPrice = (unitPrice, salesPriceLessVAT) => {
        return ((1 - unitPrice / salesPriceLessVAT) * 100).toFixed(2);
    };

    const handleInputChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;

        if (field === 'netPrice' || field === 'yield') {
            if (field === 'netPrice') {
                // Handle netPrice
                const unitPrice = Number(value) / Number(updatedProducts[index].yield);
                updatedProducts[index].unitPrice = unitPrice.toFixed(2);
            } else if (field === 'yield') {
                // Handle yield
                updatedProducts[index].yield = Number(value);
                const unitPrice = Number(updatedProducts[index].netPrice) / Number(value);
                updatedProducts[index].unitPrice = unitPrice.toFixed(2);
            }
        } else if (field === 'salesPriceVAT') {
            // Handle salesPriceVAT
            updatedProducts[index].salesPriceLessVAT = (Number(value) / VAT_RATE).toFixed(2);
        } else {
            // Handle other cases
            const unitPrice = Number(value) / Number(updatedProducts[index][field]);
            updatedProducts[index].unitPrice = unitPrice.toFixed(2);
        }

        // Calculate GP NET PRICE %
        updatedProducts[index].gpNetPrice = calculateGpNetPrice(
            parseFloat(updatedProducts[index].unitPrice),
            parseFloat(updatedProducts[index].salesPriceLessVAT)
        );

        setProducts(updatedProducts);
    };

    const handleSizeChange = (index, value) => {
        const updatedProducts = [...products];
        updatedProducts[index].size = value;
        setProducts(updatedProducts);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className='font-bold text-2xl text-center  p-2 border'>Draft - Alc</h2>
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
                    {products.map((product, index) => (
                        <tr key={index} className="text-center">
                            <td className="border">{product.name}</td>
                            <td className="border">
                                <NumericFormat className="p-1" value={product.size} allowLeadingZeros thousandSeparator="," />
                            </td>
                            <td className="border">
                                <NumericFormat
                                    className="p-1 border"
                                    type="number"
                                    value={product.yield}
                                    onChange={(e) => handleInputChange(index, 'yield', e.target.value)}
                                />
                            </td>
                            <td className="border">
                                <NumericFormat
                                    className="p-1 border"
                                    type="number"
                                    value={product.netPrice}
                                    onChange={(e) => handleInputChange(index, 'netPrice', e.target.value)}
                                    decimalScale={2}
                                />
                            </td>
                            <td className="border">{`£${product.unitPrice}`}</td>
                            <td className="border">
                                <NumericFormat
                                    className="p-1 border"
                                    type="number"
                                    value={product.salesPriceVAT}
                                    onChange={(e) => handleInputChange(index, 'salesPriceVAT', e.target.value)}
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
    );
};

export default Setting;

