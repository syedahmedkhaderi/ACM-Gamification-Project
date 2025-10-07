const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    if (process.env.MONGODB_URI) {
        console.log('📦 MongoDB connected (app data persists)');
    } else {
        console.log('📦 No MongoDB configured (writes will fail / no persistence)');
    }
});
