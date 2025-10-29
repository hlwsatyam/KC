const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/database');
const path = require('path');
dotenv.config();
connectDB();
const admin = require('firebase-admin');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Morgan setup — log every request
app.use(morgan(':method :url :status :response-time ms - :date[iso]'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
const fs = require('fs');
const uploadDirs = ['uploads/images', 'uploads/audio', 'uploads/videos', 'uploads/documents'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});









const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});




app.get('/send-notification', async (req, res) => {
  const token = 'eumpYmdnRTiSc6W31Pam6d:APA91bG1iSAnjSksjSbtkiUq0xTUdWXZm1IkxnA_ILAgDSgzUWabvlpC9EgDpv9kkqlr95nNb38yO5LqAaIJoxnw4mx9TQNm-Tvej0aKt1UVOp1GaatPtGo';

   const message = {
    token,
    notification: {
      title: '🔊 Sound Test',
      body: 'Kya aapko sound sunai di?',
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'kubercab_channel', // Same channel ID
        sound: 'default',
        priority: 'max', // HIGH se MAX karo
        defaultSound: true, // Explicitly enable default sound
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
    data: {
      sound: 'default', // Data mein bhi sound add karo
      channelId: 'kubercab_channel',
    },
  };


  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent successfully:', response);
    res.json({ success: true, response });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


























// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/chat', require('./routes/chat.js'));
app.use('/api/token', require('./routes/token.js'));
// Health route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'KuberCab API is running!',
    timestamp: new Date().toISOString()
  });
});
 
// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚗 KuberCab Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
