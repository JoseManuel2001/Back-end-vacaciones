const app = require ('./app.cjs');

const main = () => {
    app.listen(app.get("port"));
    console.log("Server vacaciones is running on port", app.get("port"));
    console.log("by Ruben Guadarrama & Jose Manuel Gutiérrez");
};

main();

