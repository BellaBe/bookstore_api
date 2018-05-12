import { INSPECT_MAX_BYTES } from 'buffer';

var BaseController = require('./basecontroller'),
    _ = require('underscore'),
    swagger = require('swagger-node-restify')

function Clients(){}

Clients.prototype = new BaseController()

module.exports = function(lib){
    var controller = new Clients()

    //list
    controller.addAction({
        'path': '/clients',
        'method': 'GET',
        'summary': 'Returns the list of clients ordered by name',
        'responseClass': 'Client',
        'nickname': 'getClients'
    }, function(req, res, next){
        lib.db.model('Client')
        .find()
        .sort('name')
        .exec(function(err, clients){
            if(err) return next(controller.RESTError('InternalServerError', err))
            controller.writeHAL(res, clients)
        })
    })
    controller.addAction({
        'path': '/clients',
        'method': 'POST',
        'summary': 'Adds a new client to the database',
        'params': [swagger.bodyParam('client', 'The JSON representation of the client', 'string')],
        'responseClass': 'Client',
        'nickname': 'addClient'
    }, function(req, res, next){
        var newClient = req.body 
        var newClientModel = lib.db.model('Client')(newClient)
        newClientModel.save(function(err, client){
            if(err) return next(controller.RESTError('InternalServerError', err))
            controller.writeHAL(res, client)
        })
    })
    controller.addAction({
        'path': '/clients/{id}',
        'method': 'GET',
        'summary': 'Returns the data of one client',
        'params': [swagger.pathParam('id', 'The id of the client', 'string')],
        'responseClass': 'Client',
        'nickname': 'getClient'
    }, function(req, res, next){
        var id = req.params.id 
        if(id != null) {
            lib.db.model('Client')
            .findOne({_id: id})
            .exec(function(err, client){
                if(err) return next(controller.RESTError('ResourceNotFoundError', 'The client id cannot be found'))
                controller.writeHAL(res, client)
            })
        }else{
            next(controller.RESTError('InvalidArgumentError', 'Invalid client id'))
        }
    })
    controller.addAction({
        'path': '/clients/{id}',
        'method': 'PUT',
        'summary': 'Updates the data of one client',
        'params': [swagger.pathParam('id', 'The id of the client', 'string'),
                   swagger.bodyParam('client', 'The content to overwrite', 'string')],
        'responseClass': 'Client',
        'nickname': 'updateClient'
    }, function(req, res, next){
        var id = req.params.id 
        if(!id) {
            return next(controller.RESTError('InvalidArgumentError', 'Invalid id'))
        }else{
            var model = lib.db.model('Client')
            model.findOne({_id: id}).exec(function(err, client){
                if(err) return next(controller.RESTError('InternalServerError', err))
                client = _.extend(client, req.body)
                client.save(function(err, newClient){
                    if(err) return next(controller.RESTError('InternalServerError', err))
                    controller.writeHAL(res, newClient)
                })
            })
        }
    })
    return controller
}