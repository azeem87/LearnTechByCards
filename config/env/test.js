module.exports = {
    db: "mongodb://localhost/carddb-test",
    port: 9001,
    app: {
        name: "Learn Tech By Cards"
    },
    google: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
}
