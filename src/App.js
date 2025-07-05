import './App.css';
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import DrawerAppBar from './components/Navbar';
import MediaCard from './components/Cart';
import ProductDetail from './components/ProductDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartPage from './components/AddCart';
import CheckoutDialog from './components/Checkout';
import MyOrders from './components/Myorders';
import Footer from './components/Footer';

function App() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [sortBy, setSortBy] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState('');
  const [tempBrand, setTempBrand] = useState('');
  const [tempSortBy, setTempSortBy] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setFiltered(data.products);
      })
      .catch(error => console.error('API Error:', error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let updated = [...products];

    if (search) {
      updated = updated.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      updated = updated.filter(p => p.category === category);
    }

    if (brand) {
      updated = updated.filter(p => p.brand === brand);
    }

    if (sortBy === 'price_asc') {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating_asc') {
      updated.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'rating_desc') {
      updated.sort((a, b) => b.rating - a.rating);
    }

    setFiltered(updated);
  }, [search, category, brand, sortBy, products]);

  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  const openDialogHandler = () => {
    setTempCategory(category);
    setTempBrand(brand);
    setTempSortBy(sortBy);
    setDialogOpen(true);
  };

  const applyFilters = () => {
    setCategory(tempCategory);
    setBrand(tempBrand);
    setSortBy(tempSortBy);
    setDialogOpen(false);
  };

  return (
    <Router>
      <Box className="main-wrapper">
        <DrawerAppBar />
        <Box className="content">
          <Routes>
            <Route
              path="/"
              element={
                <Box>
                  {/* Top bar */}
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={2}
                    ml={2}
                    mr={2}
                    mb={2.3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <TextField
                      label="Search"
                      variant="outlined"
                      size="small"
                      onChange={e => setSearch(e.target.value)}
                      sx={{ flex: 1, minWidth: '50%', maxWidth: '80%', marginBottom: '10px' }}
                    />
                    <Button
                      variant="contained"
                      onClick={openDialogHandler}
                      sx={{ whiteSpace: 'nowrap', mb: '10px' }}
                    >
                      Filters
                    </Button>
                  </Box>

                  {/* Manual Filter Dialog */}
                  {dialogOpen && (
                    <Box
                      position="fixed"
                      top={0}
                      left={0}
                      width="100vw"
                      height="100vh"
                      bgcolor="rgba(0, 0, 0, 0.4)"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      zIndex={1300}
                    >
                      <Box
                        bgcolor="white"
                        p={3}
                        borderRadius={2}
                        minWidth="320px"
                        maxWidth="90vw"
                        boxShadow={4}
                        position="relative"
                      >
                        <IconButton
                          onClick={() => setDialogOpen(false)}
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" mb={2}>
                          Filter & Sort
                        </Typography>

                        <FormControl fullWidth margin="dense" size="small">
                          <InputLabel>Category</InputLabel>
                          <Select
                            value={tempCategory}
                            label="Category"
                            onChange={e => setTempCategory(e.target.value)}
                          >
                            <MenuItem value="">All</MenuItem>
                            {categories.map(c => (
                              <MenuItem key={c} value={c}>
                                {c}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl fullWidth margin="dense" size="small">
                          <InputLabel>Brand</InputLabel>
                          <Select
                            value={tempBrand}
                            label="Brand"
                            onChange={e => setTempBrand(e.target.value)}
                          >
                            <MenuItem value="">All</MenuItem>
                            {brands.map(b => (
                              <MenuItem key={b} value={b}>
                                {b}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl fullWidth margin="dense" size="small">
                          <InputLabel>Sort By</InputLabel>
                          <Select
                            value={tempSortBy}
                            label="Sort By"
                            onChange={e => setTempSortBy(e.target.value)}
                          >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="price_asc">Price: Low to High</MenuItem>
                            <MenuItem value="price_desc">Price: High to Low</MenuItem>
                            <MenuItem value="rating_asc">Rating: Low to High</MenuItem>
                            <MenuItem value="rating_desc">Rating: High to Low</MenuItem>
                          </Select>
                        </FormControl>

                        <Box mt={3} display="flex" justifyContent="space-between" gap={1}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button variant="contained" color="primary" onClick={applyFilters}>
                            Apply
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* Loading Spinner */}
                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                      <DonutLargeIcon className="spin" sx={{ fontSize: 90, color: '#1976d2' }} />
                    </Box>
                  ) : filtered.length === 0 ? (
                    <Box textAlign="center" mt={5}>
                      <ErrorIcon sx={{ fontSize: 100, color: 'red' }} />
                      <Typography mt={2} variant="h6">
                        No products found.
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2} justifyContent="center">
                      {filtered.map(item => (
                        <Grid
                          item
                          xs={6}
                          sm={4}
                          md={4}
                          lg={2}
                          key={item.id}
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Box width="100%">
                            <MediaCard item={item} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              }
            />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutDialog />} />
            <Route path="/myorders" element={<MyOrders />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
