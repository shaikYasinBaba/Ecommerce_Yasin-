import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Stack, Divider,
  Snackbar, Alert, Radio, RadioGroup, FormControlLabel,
  FormLabel, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [candidate, setCandidate] = useState({ name: '', phone: '', address: '', email: '' });
  const [editMode, setEditMode] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [expanded, setExpanded] = useState('products');

  const navigate = useNavigate();
  const location = useLocation();
  const isBuyNow = new URLSearchParams(location.search).get('mode') === 'buynow';

  useEffect(() => {
    if (isBuyNow) {
      const buyNowItem = localStorage.getItem('buyNow');
      setCartItems(buyNowItem ? [JSON.parse(buyNowItem)] : []);
    } else {
      const storedCart = localStorage.getItem('cart');
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
    }

    const storedCandidate = localStorage.getItem('candidate');
    if (storedCandidate) {
      setCandidate(JSON.parse(storedCandidate));
      setEditMode(false);
    }
  }, [isBuyNow]);

  const handleSaveCandidate = () => {
    localStorage.setItem('candidate', JSON.stringify(candidate));
    setSnackbar({ open: true, message: 'Candidate info saved', severity: 'success' });
    setEditMode(false);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = cartItems.reduce(
    (sum, item) => sum + (item.price * item.discountPercentage * item.quantity) / 100,
    0
  );
  const grandTotal = totalPrice - totalDiscount;

  const handlePlaceOrder = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    let itemsToOrder = cartItems;

    if (isBuyNow) {
      const buyNowItem = localStorage.getItem('buyNow');
      itemsToOrder = buyNowItem ? [JSON.parse(buyNowItem)] : [];
    }

    if (!itemsToOrder || itemsToOrder.length === 0) {
      setSnackbar({ open: true, message: 'No items to place order.', severity: 'error' });
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: itemsToOrder,
      candidate,
      paymentMethod,
      totalAmount: grandTotal,
      orderDate: new Date().toISOString(),
    };

    localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));

    if (isBuyNow) {
      localStorage.removeItem('buyNow');
    } else {
      localStorage.removeItem('cart');
    }

    setSnackbar({ open: true, message: 'Order placed successfully!', severity: 'success' });

    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      {/* Accordion 1 - Products */}
      <Accordion expanded={expanded === 'products'} onChange={() => setExpanded(expanded === 'products' ? false : 'products')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">1. Products Summary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {cartItems.map((item, idx) => (
            <Box key={idx} mb={2}>
              <Typography>{item.title} (x{item.quantity})</Typography>
              <Typography variant="body2">
                Price: ${item.price} | Discount: {item.discountPercentage}%
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography>Subtotal: ${totalPrice.toFixed(2)}</Typography>
          <Typography>Discount: -${totalDiscount.toFixed(2)}</Typography>
          <Typography fontWeight="bold">Grand Total: ${grandTotal.toFixed(2)}</Typography>
          <Typography color="green">You saved ${totalDiscount.toFixed(2)}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion 2 - Candidate */}
      <Accordion expanded={expanded === 'candidate'} onChange={() => setExpanded(expanded === 'candidate' ? false : 'candidate')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">2. Candidate Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {editMode ? (
            <Stack spacing={2}>
              <TextField label="Name" value={candidate.name} onChange={(e) => setCandidate({ ...candidate, name: e.target.value })} />
              <TextField label="Mobile" value={candidate.phone} onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })} />
              <TextField label="Address" value={candidate.address} onChange={(e) => setCandidate({ ...candidate, address: e.target.value })} />
              <TextField label="Email" value={candidate.email} onChange={(e) => setCandidate({ ...candidate, email: e.target.value })} />
              <Button variant="contained" onClick={handleSaveCandidate}>Save</Button>
            </Stack>
          ) : (
            <Box>
              <Typography>Name: {candidate.name}</Typography>
              <Typography>Phone: {candidate.phone}</Typography>
              <Typography>Address: {candidate.address}</Typography>
              <Typography>Email: {candidate.email}</Typography>
              <Button onClick={() => setEditMode(true)}>Edit</Button>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Accordion 3 - Payment */}
      <Accordion expanded={expanded === 'payment'} onChange={() => setExpanded(expanded === 'payment' ? false : 'payment')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">3. Payment Method</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormLabel>Choose Payment</FormLabel>
          <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
            <FormControlLabel value="Card" control={<Radio />} label="Credit/Debit Card" />
            <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
          </RadioGroup>
        </AccordionDetails>
      </Accordion>

      <Button variant="contained" color="success" fullWidth sx={{ mt: 3 }} onClick={handlePlaceOrder}>
        Place Order
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutPage;
