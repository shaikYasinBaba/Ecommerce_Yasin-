import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Stack, Divider,
  Snackbar, Alert, Radio, RadioGroup, FormControlLabel,
  FormLabel, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import Inventory2Icon from '@mui/icons-material/Inventory2';
import PaymentIcon from '@mui/icons-material/Payment';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [candidate, setCandidate] = useState({ name: '', phone: '', address: '', email: '' });
  const [editMode, setEditMode] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});
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
      const parsed = JSON.parse(storedCandidate);
      setCandidate(parsed);
      const isValid = parsed.name && parsed.phone && parsed.address && parsed.email;
      setEditMode(!isValid);
    }
  }, [isBuyNow]);

  const validateCandidate = () => {
    const newErrors = {};
    if (!candidate.name.trim()) newErrors.name = 'Name is required';
    if (!candidate.phone.trim()) newErrors.phone = 'Phone is required';
    if (!candidate.address.trim()) newErrors.address = 'Address is required';
    if (!candidate.email.trim()) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCandidate = () => {
    if (!validateCandidate()) return;
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
    const storedCandidate = localStorage.getItem('candidate');
    const parsed = storedCandidate ? JSON.parse(storedCandidate) : null;
    const isValid = parsed && parsed.name && parsed.phone && parsed.address && parsed.email;

    if (!isValid) {
      setSnackbar({ open: true, message: 'Please fill all candidate details before placing the order.', severity: 'error' });
      setEditMode(true);
      setExpanded('candidate');
      return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const itemsToOrder = isBuyNow
      ? [JSON.parse(localStorage.getItem('buyNow'))]
      : cartItems;

    if (!itemsToOrder || itemsToOrder.length === 0) {
      setSnackbar({ open: true, message: 'No items to place order.', severity: 'error' });
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: itemsToOrder,
      candidate: parsed,
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
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      <Accordion expanded={expanded === 'products'} onChange={() => setExpanded(expanded === 'products' ? false : 'products')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Inventory2Icon sx={{ width:'1rem',mr: 1, color: 'primary.main' }} />
          <Typography>1. Products Summary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {cartItems.map((item, idx) => (
            <Box key={idx} mb={2}>
              <Typography>{item.title} (x{item.quantity})</Typography>
              <Typography variant="body2">Price: ${item.price} | Discount: {item.discountPercentage}%</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography>Subtotal: ${totalPrice.toFixed(2)}</Typography>
          <Typography>Discount: -${totalDiscount.toFixed(2)}</Typography>
          <Typography fontWeight="bold">Grand Total: ${grandTotal.toFixed(2)}</Typography>
          <Typography color="green">You saved ${totalDiscount.toFixed(2)}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'candidate'} onChange={() => setExpanded(expanded === 'candidate' ? false : 'candidate')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <PersonIcon sx={{width:'1rem',mr: 1, color: 'primary.main'}}/>
          <Typography>2. Candidate Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {editMode ? (
            <Stack spacing={2}>
              <TextField label="Name" value={candidate.name} onChange={(e) => setCandidate({ ...candidate, name: e.target.value })} error={!!errors.name} helperText={errors.name} />
              <TextField label="Mobile" value={candidate.phone} onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })} error={!!errors.phone} helperText={errors.phone} />
              <TextField label="Address" value={candidate.address} onChange={(e) => setCandidate({ ...candidate, address: e.target.value })} error={!!errors.address} helperText={errors.address} />
              <TextField label="Email" value={candidate.email} onChange={(e) => setCandidate({ ...candidate, email: e.target.value })} error={!!errors.email} helperText={errors.email} />
              <Button variant="contained" onClick={handleSaveCandidate}>Save</Button>
            </Stack>
          ) : (
            <Box>
              <Box>
              <Typography>
                  <PersonIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle',fontSize:'1rem' }} />
                  Name: {candidate.name || <span style={{ color: 'red' }}>Required</span>}
                </Typography>

                <Typography>
                  <PhoneAndroidIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle',fontSize:'1rem' }} />
                  Phone: {candidate.phone || <span style={{ color: 'red' }}>Required</span>}
                </Typography>

                <Typography>
                  <HomeIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle',fontSize:'1rem' }} />
                  Address: {candidate.address || <span style={{ color: 'red' }}>Required</span>}
                </Typography>

                <Typography>
                  <EmailIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' ,fontSize:'1rem'}} />
                  Email: {candidate.email || <span style={{ color: 'red' }}>Required</span>}
                </Typography>

              <Button onClick={() => setEditMode(true)}><EditIcon sx={{ mr: 1, verticalAlign: 'middle' ,fontSize:'1rem'}}/>Edit</Button>
            </Box>

            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'payment'} onChange={() => setExpanded(expanded === 'payment' ? false : 'payment')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <PaymentIcon  sx={{ mr: 1, color: '#4caf50',width:'1rem' }}/>
          <Typography>3. Payment Method  </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormLabel sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>Choose Payment</FormLabel>

        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="UPI"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center">
                <AccountBalanceWalletIcon sx={{ mr: 1, color: '#4caf50' }} />
                UPI
              </Box>
            }
          />
          <FormControlLabel
            value="Card"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center">
                <CreditCardIcon sx={{ mr: 1, color: '#2196f3' }} />
                Credit/Debit Card
              </Box>
            }
          />
          <FormControlLabel
            value="COD"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center">
                <LocalAtmIcon sx={{ mr: 1, color: '#ff9800' }} />
                Cash on Delivery
              </Box>
            }
          />
        </RadioGroup>
        </AccordionDetails>
      </Accordion>

      <Button variant="contained" color="success" fullWidth sx={{ mt: 3 }} onClick={handlePlaceOrder} startIcon={<ShoppingCartCheckoutIcon />}>
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
