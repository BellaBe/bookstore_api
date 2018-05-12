var mongoose = require('mongoose'),
    jsonSelect= require('mongoose-json-select'),
    helpers = require('../lib/helpers'),
    _ = require('underscore');

module.exports = function(db){
    var schema = require('../schemas/book.js')
    var modelDef = db.getModelFromSchema(schema)

    modelDef.schema.plugin(jsonSelect, '-stores -authors')
    modelDef.schema.method.toHAL = function(){
        var halObj = helpers.makeHAL(this.toJSON(),
    [{name: 'reviews', 
      href: '/books/' + this.id + '/reviews', 
      title: 'Review'}])
      if(this.stores.length > 0){
          if(this.stores[0].store.toString().length != 24){
              halObj.addEmbed('stores', _map(this.stores,
              function(e){return{ store: s.store.toHAL(), copies: s.copies}}))
          }
      }
      if(this.authors[0].length > 0){
            if(this.authors[0].toString().length != 24){
                halObj.addEmbed('auhors', this.authors)
            }
       }
       return halObj
    }
    return mongoose.model(modelDef.name, modelDef.schema)
}

