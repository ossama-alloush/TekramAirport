import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Login Endpoint via Supabase Auth
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      return res.status(401).json({ error: authError?.message || 'Invalid login credentials' });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    res.json({
      message: 'Login successful',
      token: authData.session.access_token,
      user: {
        ...authData.user,
        profile: userData || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// BOOKINGS ENDPOINTS (POST, GET, DELETE)
// -------------------------------------------------------------

// 1. Create Booking (FIXED PRICE HANDLING HERE)
app.post('/api/bookings', async (req, res) => {
  const { serviceType, bookingType, formData, counts, totalGuests, price, totalPrice, amount } = req.body;

  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) userId = user.id;
  }

  // استخراج السعر بجميع احتمالاته وتحويله لرقم
  const calculatedPrice = Number(
    price || 
    totalPrice || 
    amount || 
    formData?.price || 
    formData?.totalPrice || 
    formData?.vehiclePrice || 
    0
  );

  try {
    const payload = {
      user_id: userId,
      service_type: serviceType,
      booking_type: bookingType,
      price: calculatedPrice, // حفظه في عمود السعر العام للجدول إن وجد
      details: {
        ...formData,
        price: calculatedPrice, // ضمان حفظ السعر داخل الـ details
        totalPrice: calculatedPrice,
        counts,
        totalGuests,
      },
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([payload])
      .select();

    if (error) {
      // في حال لم يكن هناك عمود باسم price في جدول Supabase مباشرة، يحفظه بدون حقل price العلوي
      if (error.message.includes('column "price" of relation "bookings" does not exist')) {
        delete payload.price;
        const fallbackRes = await supabase.from('bookings').insert([payload]).select();
        if (fallbackRes.error) return res.status(400).json({ error: fallbackRes.error.message });
        return res.status(201).json({
          message: 'Booking created successfully',
          booking: fallbackRes.data[0],
        });
      }

      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: data[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) userId = user.id;
    }

    let query = supabase.from('bookings').select('*');

    // Filter by user_id if the request includes a logged-in user token
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE Booking by ID
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Booking removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// OTHER SERVICES ENDPOINTS
// -------------------------------------------------------------

// API - Meet & Greet
app.get('/api/meet-and-greet', async (req, res) => {
  try {
    const { data, error } = await supabase.from('meet_and_greet').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API - Lounges
app.get('/api/lounges', async (req, res) => {
  try {
    const { data, error } = await supabase.from('lounges').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Services
app.get('/api/services', async (req, res) => {
  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API - Transportation
app.get('/api/transportation', async (req, res) => {
  try {
    const { data, error } = await supabase.from('transportation').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});