export interface Tour {
  id: string;
  place: string;
  city: string;
  country: string;
  image: string;
  audio1min: string;
  audio10min: string;
}

export async function fetchToursFromCSV(csvUrl: string): Promise<Tour[]> {
  try {
    console.log('Fetching CSV from:', csvUrl);
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV content received, length:', csvText.length);
    
    // Simple CSV parsing
    const lines = csvText.split('\n').filter(line => line.trim());
    console.log('Number of lines:', lines.length);
    
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }
    
    // Get headers from first line
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('Headers:', headers);
    
    const tours: Tour[] = [];
    
    // Process each data line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Simple split by comma (for now)
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length >= 3) { // At least place, city, country
        // Generate ID from place name
        const placeName = values[0] || '';
        const id = placeName.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || `tour-${i}`;
        
        const tour: Tour = {
          id,
          place: values[0] || '',
          city: values[1] || '',
          country: values[2] || '',
          image: values[3] || '',
          audio1min: values[4] || '',
          audio10min: values[5] || ''
        };
        
        console.log('Parsed tour:', tour);
        tours.push(tour);
      }
    }
    
    console.log('Total tours parsed:', tours.length);
    return tours;
    
  } catch (error) {
    console.error('Error in fetchToursFromCSV:', error);
    throw error;
  }
} 