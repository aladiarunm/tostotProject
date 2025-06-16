let buyers = []; // temporary in-memory data

// GET all buyers
const getAllBuyers = (req, res) => {
  res.status(200).json(buyers);
};

// POST a new buyer
const createBuyer = (req, res) => {
  const newBuyer = {
    id: buyers.length ? Math.max(...buyers.map(b => b.id)) + 1 : 1,
    ...req.body,
    verified: false
  };
  buyers.push(newBuyer);
  res.status(201).json({ message: 'Buyer created successfully', buyer: newBuyer });
};

module.exports = {
  getAllBuyers,
  createBuyer
};
