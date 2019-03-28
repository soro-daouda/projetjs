const express = require('express')
const twig = require('twig')
const mysql = require('promise-mysql')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const crypto = require('crypto');
// const User = require('./User')
const expressValidator = require('express-validator')
// connexion à la base de donée

mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mois'
}).then((db)=>{
    console.log('connexion effectuer avec succès')
    let app = express()
    app.use(session({
        secret: "keyboard Cat",
        resave: false,
        saveUninitialized: false
    }))
        app.use(expressValidator())
        app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    const User = require('./User')(db)
    app.set('view engine', 'twig')
    app.use(express.static(`${__dirname}/views`))
    app.get('/', async (req,res)=>{
        let info = await User.getCommunes()
        res.render('index.twig',{info:info})
    })
    app.get('/menu',(req,res)=>{
        res.render('menu.twig')
    })
    app.get('/index',(req,res)=>{
        res.redirect('/')
    })
    app.get('/connexion',(req,res)=>{
        res.render('connexion.twig')
    })   
    app.get('/inscription',(req,res)=>{
        res.render('inscription.twig')
    })

    //profil page
    app.get('/profil',async (req,res)=>{
        if(req.session.resto)
        {
            let user = req.session.resto
            let info = await User.getCommunes()
            res.render('profil.twig',{user:user,info:info})
        }
        else
            res.redirect('/')
    })

    //inscription
    app.post('/inscription', async (req,res)=>{
        req.check('nom','le nom ne doit pas être vide').notEmpty()
        req.check('prenom','le prénom de doit pas être vide').notEmpty()
        req.check('email','email ne doit pas être vide').notEmpty()
        req.check('phone','le téléphone ne doit pas être vide').notEmpty()
        req.check('password','le mot de passe ne doit pas être vide').notEmpty()
        req.check('passwordc','la confirmation mot de passe ne doit pas être vide').notEmpty()
        const error = req.validationErrors()
        if(error){
            res.render('inscription.twig',{errors:error});
        }
        else if(req.body.password != req.body.passwordc)
        {
           let erreur = "les mots de passes ne concordent pas";
            res.render('inscription.twig',{erreur:erreur})
        }
        else
        {
            const element = req.body
            element.passwordc = crypto.createHmac('sha256',element.passwordc).update('I love cupcakes').digest('hex')
            console.log(element)
            let setUser = await User.setUser(element)
            if(setUser)
            {
                let inscript = true;
                res.render('inscription.twig',{success:inscript})
            }
            else
            {
                res.redirect('/')
            }
        }
    })


    //connexion
    app.post('/connexion', async (req,res)=>{
        req.check('email','l\'email  ne doit pas être vide').notEmpty()
        req.check('password','le mot de passe ne doit pas être vide').notEmpty()
        const error = req.validationErrors()
        if(error){
            res.render('connexion.twig',{errors:error});
        }
        else
        {
            const element = req.body
            element.password = crypto.createHmac('sha256',element.password).update('I love cupcakes').digest('hex')
            console.log(element)
            let getUser = await User.getUser(element)
            console.log(getUser)
            if(getUser.id)
            {
                req.session.resto = getUser
                res.redirect('/profil')
            }
            else
            {
                let faux = true;
                res.render('connexion.twig',{faux:faux})

            }
        }
    })


    //deconnexion
    app.get('/profil/deconnexion',(req,res)=>{
        delete req.session.resto
        res.redirect('/')
    })

    //listes restaurant
    app.post('/profil',async (req,res)=>{
        let id_commune = req.body.commune
        let Namecomune = await User.getCommuneName(id_commune)
        let resto = await User.getRestaurants(id_commune)
        if(resto)
        {
            let notview = true
            let infos  = resto
            res.render('restaurant.twig',{infos:infos,nomcommune:Namecomune,notview:notview})
        }
    })
    app.post('/', async (req, res)=>{
        let id_commune = req.body.commune
        let Namecomune = await User.getCommuneName(id_commune)
        let resto = await User.getRestaurants(id_commune)
        if(resto)
        {
            let infos  = resto
            let notview = false
            res.render('restaurant.twig',{infos:infos,nomcommune:Namecomune,notview:notview})
        }
    })
app.listen(8090,console.log("j'écoute sur le port 8090"))
})
.catch((error)=>{
    console.log("connexion échoué")
})