const apps = require('./src/app');


const PORT = process.env.PORT || 5000;

apps.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})