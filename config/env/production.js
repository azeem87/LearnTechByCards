module.exports = {
    db: "mongodb://localhost/carddb",
    app: {
        name: "Learn Tech By Cards"
    },
    google: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:9000/auth/google/callback"
    }
}
