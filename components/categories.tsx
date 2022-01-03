const categories = [
  {
    key: 1,
    name: 'Wood',
    toggle: false,
    icon: 'https://storage.googleapis.com/greenday-6aba2.appspot.com/Materials/Wood.png'
  },
  {
    key: 2,
    name: 'Metal',
    toggle: false,
    icon: 'https://storage.googleapis.com/greenday-6aba2.appspot.com/Materials/Metal.png'
  },
  {
    key: 3,
    name: 'Glass',
    toggle: false,
    icon: 'https://storage.googleapis.com/greenday-6aba2.appspot.com/Materials/Glass.png'
  },
  {
    key: 4,
    name: 'Plastic',
    toggle: false,
    icon: 'https://storage.googleapis.com/greenday-6aba2.appspot.com/Materials/Plastic.png'
  },
  {
    key: 5,
    name: 'Paper',
    toggle: false,
    icon: 'https://storage.googleapis.com/greenday-6aba2.appspot.com/Materials/Paper.png'
  },
  {
    key: 6,
    name: 'Electronic',
    toggle: false,
    icon: "https://storage.googleapis.com/greenday-6aba2.appspot.com/Materials/Electronic.png"
  },
] 


// General Vs. Specific

// General:
// Recyclable, Bio-compostable, Landfill

// Specific:
// Batteries, waste Oil, scrap metal (maybe), electronics, glass, cardboard

// Steps:

// 1: Take a picture of a trash can and give options to mark it as a user-generated marker (longest) 
// 2: Convert (lat, lng) data to address given a certain distance away (low-priority) 
// 3: (Albert) create a function to determine if valid address 
// 4: Details: improve the ai to get top 3 predictions
// 5: how to categorize ML and map data


export default categories