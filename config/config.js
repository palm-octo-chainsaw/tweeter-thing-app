const config = {
    production:{
        SECRET: process.env.SECRET,
        DATABASE: process.env.DATABASE
    },

    default:{
        SECRET: 'secretkey',
        DATABASE: 'mongodb+srv://chocho:zlASVA1zL&@poster.rssdu.mongodb.net/Poster?retryWrites=true&w=majority'
    }
}

exports.get = function get(env){
    return config[env] || config.default
}