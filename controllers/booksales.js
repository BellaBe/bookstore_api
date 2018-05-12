var BaseController = require('./basecontroller'),
    _ = require('underscore'),
    swagger = require('swagger-node-restify')

function BookSales(){}

BookSales.prototype = new BaseController()

module.exports = function(lib){
    var controller = new BookSales()

    controller.addAction({
        'path': '/booksales',
        'method': 'GET',
        'summary': 'Returns the list of booksales',
        'params': [swagger.queryParam('start_date', 'Filter sales done after (or on) this date', 'string'),
                   swagger.queryParam('end_date', 'Filter sales done before(or on) this date', 'string'),
                   swagger.queryParam('store_id', 'Filter sales done on this store', 'string')],
        'responseClass': 'BookSale',
        'nickname': 'getBookSales'
    }, function(req, res, next){
        console.log(req)

        var criteria = {}
        if(req.params.start_date)
        criteria.date = {$gte: req.params.start_date}
        if(req.params.end_date)
        criteria.date = {$lte: req.params.end_date}
        if(req.params.store_id)
        criteria.store = req.params.start_id

        lib.db.model('Booksale')
        .find(criteria)
        .populate('books')
        .populate('client')
        .populate('employee')
        .populate('store')
        .exec(function(err, sales){
            if(err) return next(controller.RESTError('InternalServerError', err))
            controller.writeHAL(res, sales)
        })
    })
    controller.addAction({
        'path': '/booksales',
        'method': 'POST',
        'summary': 'Records a new booksale',
        'params': [swagger.bodyParam('booksale', 'JSON representation of the new booksale', 'string')],
        'nickname': 'newBookSale'
    }, function(req, res, next){
        var body = req.body 
        if(body){
            var newSale = lib.db.model('BookSale')(body)
            newSale.save(function(err, sale){
                if(err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, sale)
            })
        }else{
            next(controller.RESTError('InvalidArgumentError', 'Missing json data'))
        }
    })
    return controller
}