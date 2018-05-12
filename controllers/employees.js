var BaseController = require('./basecontroller'),
    _ = require('underscore'),
    swagger = require('swagger-node-restify')

function Employees(){}

Employees.prototype = new BaseController()

module.exports = function(lib){
    var controller = new Employees()

    //list
    controller.addAction({
        'path': '/employees',
        'method': 'GET',
        'summary': 'Returns the list of employees accross all stores',
        'responseClass': 'Employee',
        'nickname': 'getEmployees'
    }, function(req, res, next){
        lib.db.model('Employee')
        .find()
        .exec(function(err, list){
            if(err) return next(controller.RESTError('InternalServerError', err))
            controller.writeHAL(res, list)
        })
    })
    controller.addAction({
        'path': '/employees/{id}',
        'method': 'GET',
        'summary': 'Returns the data of one employee',
        'params': [swagger.pathParam('id', 'The if of the employee', 'string')],
        'responseClass': 'Employee',
        'nickname': 'getEmployee'
    }, function(req, res, next){
        var id = req.params.id 
        if(id) {
            lib.db.model('Employee')
            .findOne({_id: id})
            .exec(function(err, empl){
                if(err) return next(err)
                if(!empl) {
                    return next(controller.RESTError('ResourceNotFoundError', 'Not found'))
                }
                controller.writeHAL(res, empl)
            })
        }else{
            next(controller.RESTError('InvalidArgumentError', 'Invalid id'))

        }
    })
    controller.addAction({
        'path': '/employees',
        'method': 'POST',
        'summary': 'Adds a new employee to the list',
        'params': [swagger.bodyParam('employee', 'The JSON data of the employee', 'string')],
        'responseClass': 'Employee',
        'nickname': 'newEmployee'
    }, function(req, res, next){
       var data = req.body 
       if(data){
           var newEmployee = lid.db.model('Employee')(data)
           newEmployee.save(function(err, emp){
               if(err) return next(controller.RESTError('InternalServerError', err))
               controller.writeHAL(res, emp)
           })
       }else{
           next(controller.RESTError('InvalidArgumentError', 'No data received'))
       }
    })
    controller.addAction({
        'path': '/employees/{id}',
        'method': 'PUT',
        'summary': 'UPDATES an employee\'s information',
        'params': [swagger.pathParam('id', 'The id of the employee', 'string')],
        'responseClass': 'Employee',
        'nickname': 'updateEmployee'
    }, function(req, res, next){
        var data = req.body 
        var id = req.params.id 
        if(id){
            lid.db.model('Employee')
            .findOne({_id:id})
            .exec(function(err,emp){
                if(err) return next(controller.RESTError('InternalServerError', err))
                emp = _.extend(emp, data)
                emp.save(function(err, employee){
                    if(err) return next(controller.RESTError('InternalServerError'))
                    controller.writeHAL(res.employee)
                })
            })
        }else{
            next(controller.RESTError('InvalidArgumentError', 'Invalid id received'))
        }
    })
    return controller
}