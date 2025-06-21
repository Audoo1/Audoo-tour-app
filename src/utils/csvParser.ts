import { Tour } from '@/types/tour';

export async function fetchToursFromCSV(): Promise<Tour[]> {
  try {
    console.log('Fetching CSV from Netlify function...');
    
    // Use the Netlify function instead of direct Dropbox URL
    const response = await fetch('/.netlify/functions/fetch-csv');
    
    console.log('Netlify function response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('CSV text received, length:', csvText.length);
    console.log('CSV preview:', csvText.substring(0, 200));
    
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error in fetchToursFromCSV:', error);
    throw error;
  }
}

function parseCSV(csvText: string): Tour[] {
  try {
    console.log('Parsing CSV text...');
    
    // Split by lines and filter out empty lines
    const lines = csvText.split('\n').filter(line => line.trim());
    console.log('Number of lines:', lines.length);
    
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }
    
    // Parse header row
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    console.log('Headers:', headers);
    
    // Find column indices
    const idIndex = headers.findIndex(h => h === 'id' || h === 'place_id');
    const placeIndex = headers.findIndex(h => h === 'place' || h === 'name' || h === 'title');
    const cityIndex = headers.findIndex(h => h === 'city');
    const countryIndex = headers.findIndex(h => h === 'country');
    const imageIndex = headers.findIndex(h => h === 'image' || h === 'image_url');
    const audio1minIndex = headers.findIndex(h => h === 'audio1min' || h === 'audio_1min' || h === '1min_audio');
    const audio10minIndex = headers.findIndex(h => h === 'audio10min' || h === 'audio_10min' || h === '10min_audio');
    
    console.log('Column indices:', {
      id: idIndex,
      place: placeIndex,
      city: cityIndex,
      country: countryIndex,
      image: imageIndex,
      audio1min: audio1minIndex,
      audio10min: audio10minIndex
    });
    
    // Parse data rows
    const tours: Tour[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Simple CSV parsing - split by comma and handle quoted values
      const values = parseCSVLine(line);
      console.log(`Row ${i} values:`, values);
      
      if (values.length < Math.max(idIndex, placeIndex, cityIndex, countryIndex, imageIndex, audio1minIndex) + 1) {
        console.warn(`Row ${i} has insufficient columns, skipping`);
        continue;
      }
      
      const tour: Tour = {
        id: values[idIndex] || `tour-${i}`,
        place: values[placeIndex] || 'Unknown Place',
        city: values[cityIndex] || 'Unknown City',
        country: values[countryIndex] || 'Unknown Country',
        image: values[imageIndex] || '',
        audio1min: values[audio1minIndex] || '',
        audio10min: values[audio10minIndex] || ''
      };
      
      // Clean up the data
      tour.id = tour.id.trim();
      tour.place = tour.place.trim();
      tour.city = tour.city.trim();
      tour.country = tour.country.trim();
      tour.image = tour.image.trim();
      tour.audio1min = tour.audio1min.trim();
      tour.audio10min = tour.audio10min.trim();
      
      // Only add tours with essential data
      if (tour.place && tour.place !== 'Unknown Place') {
        tours.push(tour);
        console.log(`Added tour: ${tour.place}`);
      }
    }
    
    console.log('Parsed tours:', tours);
    return tours;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values.map(v => v.replace(/^"|"$/g, '')); // Remove surrounding quotes
} 