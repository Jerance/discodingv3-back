import 'dotenv/config'
import { initDb } from './db/mongo'

// on commence par se connecter à la DB
initDb()
    // si tout s'est bien passé
    .then(() => {
        // on lance le serveur web
        import('./server').then(({ initWebServer }) => {
            initWebServer()
        })
    })
    // si pas co à la DB
    .catch(err => {
        console.error(err)
    })
