var BaseController = require('./basecontroller'),
    _ = require('underscore'),
    swagger = require('swagger-node-restify')

function BookSales(){}

BookSales.prototype = new BaseController()

module.exports = function(lib){
    var controller = new BookSales()

    //list
    controller.addAction({
        'path': '/authors',
        'method': 'GET',
        'summary': 'Returns the list of authors across all stores',
        'params': [swagger.queryParam('genre', 'Filter authorsbu genre of their books', 'string'),
                   swagger.queryParam('q', 'Search parameter', 'string')],
        'responseClass': 'Author',
        'nickname': 'getAuthors'
    }, function(req, res, next){
        var criteria = {}
        if(req.params.q){
            var expr = new RegExp('.*' + req.params.q + '.*', 'i')
            criteria.$or = [
                {name: expr},
                {description: expr}
            ]
        }
        var filterByGenre = false || req.params.genre 
        if(filterByGenre){
            lib.db.model('Book')
            .find({genre: filterByGenre})
            .exec(function(err, books){
                if(err) return next(controller.RESTError('InternalServerError', err))
                findAuthors(_.pluck(books, '_id'))
            })
        }else{
            findAuthors()
        }
        function findAuthors(bookIds){
            if(bookIds) {
                criteria.books = {$in: bookIds}
            } 
            lib.db.model('Author')
            .find(criteria)
            .exec(function(err, authors){
                if(err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, authors)
            })
        }
    })
    //get
    controller.addAction({
        'path': '/authors/{id}',
        'method': 'GET',
        'summary': 'Returns all the data from one specific author',
        'responseClass': 'Author',
        'nickname': 'getAuthor'
    }, function(req, res, next){
        var id = req.params.id
        if(id){
            lib.db.model('Author')
            .findOne({_id:id})
            .exec(function(err, author){
                if(err) return next(controller.RESTError('InternalServerError', err))
                if(!author) {
                    return next(controller.RESTError('ResourceNotFoundError', 'Author not found'))
                }
                controller.writeHAL(res, author)
            })
        }else{
            next(controller.RESTError('InvalidArgumentError', 'Missing author id'))
        }
    })
    //post
    controller.addAction({
        'path': '/authors',
        'method': 'POST',
        'summary': 'Add a new author to the database',
        'params': [swagger.bodyParam('author', 'JSON rappresentation of the data', 'string')],
        'responseClass': 'Author',
        'nickname': 'addAuthor'
    }, function(req, res, next){
        var body = req.body 
        if(body) {
            var newAuthor = lib.db.model('Author')(body)
            newAuthor.save(function(err, author){
                if(err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, author)
            })
        }else{
            next(controller.RESTError('InvalidArgumentError', 'Missing author id'))
        }
    })
    //put
    controller.addAction({
        'path': '/authors/{id}',
        'method': 'PUT',
        'summary': 'UPDATES an author\'s information',
        'params': [swagger.pathParam('id', 'The id of the author', 'string'),
                   swagger.bodyParam('author', 'The new information to update', 'string')],
        'responseClass': 'Author',
        'nickname': 'updateAuthor'
    }, function(req, res, next){
        var data = req.body 
        var id = req.params.id 
        if(id){
            lib.db.model('Author')
            .findOne({_id: id})
            .ecex(function(err, author){
                if(err) return next(controller.RESTError('InternalServerError', err))
                if(!author) return next(controller.RESTError('ResourceNotFoudError', 'Author not found'))
                author = _.extend(author, data)
                author.save(function(err, data){
                    if(err) return next(controller.RESTError('InternalServerError', err))
                    res.json(controller.toHAL(data))
                })
            })
        }else{
            next(controller.RESTError('InvalidArgumentError', 'Invalid id received'))
        }
    })
    //books
    controller.addAction({
        'path': '/authors/{id}/books',
        'method': 'GET',
        'summary': 'Returns the data from all the books of one specific author',
        'params': [swagger.pathParam('id', 'The id of the author', 'string')],
        'responseClass': 'Book',
        'nickname': 'getAuthorsBooks'
    }, function(req, res, next){
        var id = req.params.id 
        if(id) {
            lib.db.model('Author')
            .findOne({_id: id})
            .populate('books')
            .exec(function(err, author){
                if(err) return next(controller.RESTError('InternalServerError', err))
                if(!author){
                    return next(controller.RESTError('ResourceNotFoundError', 'Author not found'))
                }
                controller.writeHAL(res, author.books)
            })
        }else{
            next(controller.RESTError('InvalidArgumentError', 'Missing author id'))
        }
    })
    return controller
}