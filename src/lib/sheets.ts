import Papa from "papaparse";

export async function getClassesData() {
  const PUBLISHED_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSHJJikovmz71pcvsw5pZdCSBWbZgG3LcIn3mx6NqZFz69nFhOv-JVegJbfAmvg9yCnbKyhBCyFWTai/pub?output=csv";

  try {
    const res = await fetch(PUBLISHED_CSV_URL, { 
      next: { revalidate: 60 } // Re-fetches the data every 60 seconds (ISR)
    });

    if (!res.ok) {
      console.error("Failed to fetch Google Sheets CSV:", res.statusText);
      return [];
    }

    const csvText = await res.text();
    
    // Parse the CSV
    const parsed = Papa.parse(csvText, {
      header: true, // Use the first row as keys (Class Name, Date, Status, Price)
      skipEmptyLines: true,
    });

    if (!parsed.data || parsed.data.length === 0) {
      return [];
    }

    // Map the parsed data into our expected format
    const classes = parsed.data.map((row: any) => {
      return {
        name: row["Class Name"] || "",
        date: row["Date"] || "",
        price: row["Price"] || "",
        status: row["Status"] || "Available",
      };
    });

    return classes;
  } catch (error) {
    console.error("Error fetching Google Sheets CSV data:", error);
    return [];
  }
}
