const app = require('./app');
const PORT = 5007;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📦 Using in-memory storage (data resets on restart)');
});
