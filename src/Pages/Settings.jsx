import React, { useState } from 'react'

function Settings() {
    const [formData, setFormData] = useState({
        // Initialize your form fields in state
        firstName: '',
        lastName: '',
        // ...other fields
    });
    console.log(formData)
    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Spread the existing form data and update the specific field
        setFormData({
            ...formData,
            [name]: value, // Update the field corresponding to the input name
        });
    }
    return (
        <input
            className="p-1 border"
            type="number"
            name='yeild'
            // value={product.yield}
            onChange={handleInputChange}
        />
    )
}

export default Settings;