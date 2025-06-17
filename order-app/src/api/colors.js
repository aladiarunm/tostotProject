// mock api

let colors = [
  {
    id: 1,
    name: "Red",
    code: "#FF0000",
    description: "Bright red color",
    status: "A",
    created_on: "2025-06-17T10:30:00",
    last_modified_on: "2025-06-17T10:30:00"
  },
  {
    id: 2,
    name: "Green",
    code: "#00FF00",
    description: "Natural green color",
    status: "A",
    created_on: "2025-06-17T10:35:00",
    last_modified_on: "2025-06-17T10:35:00"
  },
  {
    id: 3,
    name: "Blue",
    code: "#0000FF",
    description: "Ocean blue shade",
    status: "I",
    created_on: "2025-06-17T10:40:00",
    last_modified_on: "2025-06-17T10:45:00"
  },
  {
    id: 4,
    name: "Black",
    code: "#000000",
    description: "Standard black color",
    status: "D",
    created_on: "2025-06-17T10:50:00",
    last_modified_on: "2025-06-17T10:50:00"
  }
]


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getColors = async () => {
  await delay(700);
  return { success: true, data: colors };
};

export const addColor = async (newColor) => {
  await delay(500);
  const id = colors.length ? Math.max(...colors.map((b) => b.id)) + 1 : 1;
  const now = new Date().toISOString();
  // By default, if status is not provided, we'll use 'A' (active)
  const brand = { id, ...newColor, status: newColor.status || 'A', created_on: now, last_modified_on: now };
  colors.push(brand);
  return { success: true, data: brand };
};

export const updateColor = async (id, updatedData) => {
  await delay(500);
  const index = colors.findIndex((b) => b.id === id);
  if (index === -1) return { success: false, error: 'Color not found' };

  // Update the brand and modify its last_modified_on timestamp
  const now = new Date().toISOString();
  colors[index] = {
    ...colors[index],
    ...updatedData,
    last_modified_on: now,
  };
  return { success: true, data: colors[index] };
};

export const deleteColor = async (id) => {
  await delay(500);
  const index = colors.findIndex((b) => b.id === id);
  if (index === -1) return { success: false, error: 'Color not found' };

  // Remove the brand from the array (or you could update its status to 'D' for deleted)
  colors.splice(index, 1);
  return { success: true };
};
