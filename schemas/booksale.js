module.exports = {
    'id': 'BookSale',
    'properties': {
        'date': {
            'type': 'date',
            'description': 'Date of the transaction'
        },
        'books': {
            'type': 'array',
            'description': 'Books sold',
            'items': {
                '$ref': 'Book'
            }
        },
        'store': {
            'type': 'object',
            'description': 'The store where this sale tool place',
            '$ref': 'Store'
        },
        'employee': {
            'type': 'object',
            'description': 'The empoyee who makes the sale',
            '$ref': 'Employee'
        },
        'client':{
            'type': 'object',
            'description': 'The person who gets the book',
            '$ref': 'Client'

        },
        'totalAmount': {
            'type': 'integer'
        }
    }
}