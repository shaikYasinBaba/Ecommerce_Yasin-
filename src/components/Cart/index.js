import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';


export default function MediaCard({ item }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(item.minimumOrderQuantity || 1);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!item || !item.thumbnail) return null;

  const handleAddToCart = () => {
    setDialogOpen(true);
    setError('');
  };

  const handleSave = () => {
    if (quantity > item.stock) {
      setError('Stock not available for this quantity');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exists = cart.find((p) => p.id === item.id);

    const updated = exists
      ? cart.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      : [...cart, { ...item, quantity }];

    localStorage.setItem('cart', JSON.stringify(updated));
    setDialogOpen(false);
    setSnackOpen(true);
  };

  const handleQuantityChange = (val) => {
    const newQty = quantity + val;
    if (newQty >= item.minimumOrderQuantity && newQty <= item.stock) {
      setQuantity(newQty);
      setError('');
    } else if (newQty > item.stock) {
      setError('Stock not available for this quantity');
    }
  };

  return (
    <>
      <Card
        sx={{
          width: { xs: 160, sm: 180, md: 200 },
          height: '100%',
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={item.thumbnail}
          alt={item.title}
          sx={{ objectFit: 'contain', padding: 1, backgroundColor: '#f5f5f5' }}
        />
        <CardContent>
          <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }} noWrap>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.5rem', sm: '0.85rem' }, mb: 1 }}>
            ${item.price} USD
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Rating value={item.rating} precision={0.1} sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }} readOnly />
            <Typography variant="body2">({item.rating})</Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size="small" variant="contained" sx={{ fontSize: '0.5rem', mb: 1 }} component={Link} to={`/product/${item.id}`}>
            More Details
          </Button>
          <Button size="small" variant="outlined" sx={{ fontSize: '0.5rem', mb: 1 }} onClick={handleAddToCart}>
           <ShoppingCartCheckoutIcon sx={{fontSize:'1rem'}}/> Add to Cart
          </Button>
        </CardActions>
      </Card>

      {/* Quantity Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Select Quantity</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="outlined"
                sx={{ fontWeight: '900', fontSize: '1.5rem', borderRadius: '25%' }}
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= item.minimumOrderQuantity}
              >
                -
              </Button>
              <TextField
                value={quantity}
                sx={{ width: '4rem' }}
                inputProps={{ readOnly: true }}
              />
              <Button
                variant="outlined"
                sx={{ fontWeight: '900', fontSize: '1.5rem', borderRadius: '25%' }}
                onClick={() => handleQuantityChange(1)}
              >
                +
              </Button>
            </Stack>
            <Typography variant="body2">Stock Available: {item.stock}</Typography>
            <Typography variant="body2">Minimum Order Quantity: {item.minimumOrderQuantity}</Typography>
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Added to cart
        </Alert>
      </Snackbar>
    </>
  );
}
