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
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    // Parse CSV to JSON
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const tours: Tour[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle commas within quoted fields
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim()); // Add the last value
      
      if (values.length >= headers.length) {
        const tour: any = {};
        headers.forEach((header, index) => {
          tour[header] = values[index] || '';
        });
        
        // Generate ID from place name
        const id = tour.place?.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || `tour-${i}`;
        
        tours.push({
          id,
          place: tour.place || '',
          city: tour.city || '',
          country: tour.country || '',
          image: tour.image || '',
          audio1min: tour['1 min audio'] || '',
          audio10min: tour['10 min audio'] || ''
        });
      }
    }
    
    return tours;
  } catch (error) {
    console.error('Error fetching CSV:', error);
    return [];
  }
} 