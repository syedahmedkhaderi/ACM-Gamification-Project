const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, 'localhost', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📦 Using in-memory storage (data resets on restart)');
});
