import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => {
    try {
      const stored = localStorage.getItem('cart');
      setCart(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleFocus = () => {
      loadCart();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleAddMore = () => {
    navigate('/');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Your Cart</Typography>

      {cart.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {cart.map(item => (
              <Grid item xs={12} md={6} key={item.id}>
                <Card sx={{ display: 'flex', width: '80vw' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 120,
                      objectFit: 'contain',
                      background: '#f5f5f5',
                      p: 1,
                    }}
                    image={item.thumbnail}
                    alt={item.title}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6" noWrap>
                        {item.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        Price: ${item.price} × {item.quantity}
                      </Typography>
                      <Typography variant="subtitle2">
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </CardContent>
                    <Box sx={{ pl: 2, pb: 2 }}>
                      <Button color="error" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Total Bill:</Typography>
            <Typography variant="h6">${total.toFixed(2)}</Typography>
          </Box>

          {/* Checkout + Add More Buttons */}
          <Box mt={4} display="flex" justifyContent="space-between" gap={2}>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                
                fontSize: '0.8rem',
                fontWeight: 'bold',
                width: '30%',
              }}
              onClick={handleAddMore}
            >
              Add More
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ffa500',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                width: '30%',
              }}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
