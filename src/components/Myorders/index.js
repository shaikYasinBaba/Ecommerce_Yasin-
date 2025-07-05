import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    setOrders(storedOrders ? JSON.parse(storedOrders) : []);
  }, []);

  const cancelOrder = (index) => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setSnackbar({ open: true, message: 'Order cancelled.', severity: 'info' });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order, index) => {
          if (!order.items || order.items.length === 0) return null;

          const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const totalDiscount = order.items.reduce(
            (sum, item) => sum + (item.price * item.discountPercentage * item.quantity) / 100,
            0
          );
          const grandTotal = totalPrice - totalDiscount;

          const summaryItem = order.items[0];
          const orderDate = new Date(order.orderDate).toLocaleString();

          const shortTitle = (() => {
            if (!summaryItem?.title) return 'Untitled Product';
            const words = summaryItem.title.trim().split(' ');
            return words.length >= 3 ? `${words[0]} ${words[1]}...` : words.join(' ');
          })();

          return (
            <Accordion key={order.id}>
              <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={12} sm={4}>
                    <Typography fontWeight="bold">Order #{index + 1}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Tooltip title={summaryItem.title || 'Untitled Product'}>
                      <Typography noWrap>
                        {shortTitle} (x{summaryItem.quantity})
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={3} textAlign={{ xs: 'left', sm: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      Date: {orderDate}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails>
                <Box>
                  <Grid container spacing={2}>
                    {order.items.map((item, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Typography>{item.title || 'Untitled'} (x{item.quantity})</Typography>
                        <Typography variant="body2">
                          ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Grid container>
                    <Grid item xs={6} display={'flex'} flexDirection={'column'}>
                      <Typography variant="body2">Payment: {order.paymentMethod}</Typography>
                      <Typography variant="body2" color="error" >
                        Discount: -${totalDiscount.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right" marginLeft={'1rem'}>
                      <Typography variant="body2">Subtotal: ${totalPrice.toFixed(2)}</Typography>
                      <Typography fontWeight="bold">
                        Grand Total: ${grandTotal.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="flex-start" mt={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => cancelOrder(index)}
                    >
                      Cancel Order
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}

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

export default MyOrders;
