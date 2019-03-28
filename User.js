let db;
module.exports = (_db)=>{
    db = _db
    return User
}
let User =  class {
    static setUser(element){
        return new Promise((next)=>{
            db.query('INSERT INTO utilisateurs (nom,prenom,email,tel,password) VALUES(?,?,?,?,?)',[element.nom,element.prenom,element.email,element.phone,element.passwordc])
            .then((result)=>{
                if(result)
                {
                    next(result)
                }
                else
                {
                    next(new Error('il y a eu une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getUser(element){
        return new Promise((next)=>{
            db.query('SELECT * FROM utilisateurs WHERE email = ? AND password = ?',[element.email,element.password])
            .then((result)=>{
                if(result[0])
                {
                    next(result[0])
                }
                else
                {
                    next(new Error('il y a eu une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getCommunes(){
        return new Promise((next)=>{
            db.query('SELECT * FROM communes')
            .then((result)=>{
                if(result){
                    next(result)
                }
                else{
                    next(new Error('il ya une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getRestaurants(id_commune){
        return new Promise((next)=>{
            db.query('SELECT *FROM restaurants WHERE id_communes = ?',[id_commune])
            .then((result)=>{
                if(result){
                    next(result)
                }
                else{
                    next(new Error('il ya une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getCommuneName(id_commune){
        return new Promise((next)=>{
            db.query('SELECT nom_communes FROM communes WHERE id_commmunes = ?',[id_commune])
            .then((result)=>{
                if(result[0]){
                    next(result[0])
                }
                else{
                    next(new Error('il ya une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }
}