import React, { useState, useEffect } from 'react';

export default function MealPlanner() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedLocation, setSelectedLocation] = useState('All');
  useEffect(() => {
    fetch('/menu_data.json')
      .then((res) => res.json()) 
      .then((data) => setMenuItems(data)) 
      .catch((err) => console.error("Error loading menu:", err)); 
  }, []); 

  const toggleItem = (url) => {
    setSelectedIds((prevSet) => {
      const nextSet = new Set(prevSet);

      if (nextSet.has(url)) {
        nextSet.delete(url); 
      } else {
        nextSet.add(url);    
      }

      return nextSet; 
    });
  };

  const totals = menuItems
    .filter((item) => selectedIds.has(item.url)) // Keep only checked items
    .reduce(
      (accumulator, item) => ({
     
        calories: accumulator.calories + (item.nutrition?.calories || 0),
      
        protein: accumulator.protein + (item.nutrition?.protein || 0),
      }),
      { calories: 0, protein: 0 } 
    );

 
  const locations = ['All', ...new Set(menuItems.map((item) => item.location))];

  
  const displayedItems = selectedLocation === 'All' 
    ? menuItems 
    : menuItems.filter((item) => item.location === selectedLocation);


 
  return (
    <div style={styles.container}>
      
      {/* HEADER & STICKY DASHBOARD COUNTER */}
      <header style={styles.header}>
        <h1>UCLA Dining Tracker</h1>
        
        {/* Banner displaying real-time calorie and protein totals */}
        <div style={styles.counterBar}>
          <div>
            <strong>Total Calories:</strong> {totals.calories} kcal
          </div>
          <div>
            {/* toFixed(1) formats decimals to 1 place (e.g., 18.5g) */}
            <strong>Total Protein:</strong> {totals.protein.toFixed(1)} g
          </div>
          <div>
            <strong>Items Selected:</strong> {selectedIds.size}
          </div>
        </div>
      </header>


      {/* LOCATION FILTER TABS */}
      <div style={styles.filterContainer}>
        {locations.map((loc) => (
          <button
            key={loc} // Unique key required by React when mapping lists
            onClick={() => setSelectedLocation(loc)} // Switch active location on click
            style={{
              ...styles.filterBtn,
              // Highlight active tab with UCLA Blue background
              backgroundColor: selectedLocation === loc ? '#0055A5' : '#e0e0e0',
              color: selectedLocation === loc ? '#fff' : '#000',
            }}
          >
            {loc}
          </button>
        ))}
      </div>


      {/* INTERACTIVE MENU ITEM CARDS */}
      <div style={styles.list}>
        {displayedItems.map((item) => {
          // Check if this specific item is currently selected by the user
          const isSelected = selectedIds.has(item.url);

          return (
            <div
              key={item.url}
              onClick={() => toggleItem(item.url)} // Clicking anywhere on card toggles selection
              style={{
                ...styles.card,
                // Green border and light green background when checked
                borderColor: isSelected ? '#2e7d32' : '#ccc',
                backgroundColor: isSelected ? '#e8f5e9' : '#fff',
              }}
            >
              {/* Visual Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}} // Empty handler because parent div handles onClick
                style={styles.checkbox}
              />

              {/* Item Details */}
              <div style={styles.cardDetails}>
                <span style={styles.locationTag}>{item.location}</span>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.macros}>
                  🔥 {item.nutrition?.calories || 0} cal | 🥩 {item.nutrition?.protein || 0}g protein
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// INLINE STYLING OBJECT
const styles = {
  container: { 
    maxWidth: '650px', 
    margin: '0 auto', 
    padding: '16px', 
    fontFamily: 'sans-serif',
    color: '#333' // Dark text color to override Vite dark mode default
  },
  header: { 
    position: 'sticky', 
    top: 0, 
    backgroundColor: '#fff', 
    paddingBottom: '10px', 
    zIndex: 10,
    borderBottom: '1px solid #eee'
  },
  counterBar: { 
    display: 'flex', 
    justify: 'space-between', 
    alignItems: 'center',
    gap: '12px',
    background: '#0055A5', 
    color: '#fff', 
    padding: '12px 16px', 
    borderRadius: '8px',
    flexWrap: 'wrap' // Prevents numbers from smashing into each other on small screens
  },
  filterContainer: { 
    display: 'flex', 
    gap: '8px', 
    overflowX: 'auto', 
    padding: '12px 0' 
  },
  filterBtn: { 
    border: 'none', 
    padding: '8px 16px', 
    borderRadius: '16px', 
    cursor: 'pointer', 
    whiteSpace: 'nowrap',
    fontWeight: 'bold'
  },
  list: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px',
    marginTop: '12px'
  },
  card: { 
    display: 'flex', 
    alignItems: 'center', 
    border: '2px solid', 
    padding: '12px 16px', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    transition: '0.2s' 
  },
  checkbox: { 
    width: '20px', 
    height: '20px', 
    marginRight: '12px',
    cursor: 'pointer'
  },
  cardDetails: { flexGrow: 1 },
  locationTag: { fontSize: '11px', textTransform: 'uppercase', color: '#0055A5', fontWeight: 'bold' },
  itemName: { margin: '2px 0 4px 0', fontSize: '16px', color: '#111' },
  macros: { margin: 0, fontSize: '14px', color: '#555' }
};
