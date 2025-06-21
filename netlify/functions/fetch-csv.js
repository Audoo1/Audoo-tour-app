const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const csvUrl = 'https://www.dropbox.com/scl/fi/pjphgsxrugwql8nr3hy1w/tours.csv?rlkey=14la6binudmu33bfkfwfb5obe&st=ay2b9jhc&raw=1';
    
    console.log('Fetching CSV from:', csvUrl);
    
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvData = await response.text();
    
    console.log('CSV data length:', csvData.length);
    console.log('CSV data preview:', csvData.substring(0, 200));
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/plain'
      },
      body: csvData
    };
  } catch (error) {
    console.error('Error fetching CSV:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch CSV data',
        message: error.message
      })
    };
  }
}; 