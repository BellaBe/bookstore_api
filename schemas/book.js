module.exports = {
    'id': 'Book',
    'properties': {
        'title':{
            'type': 'string',
            'description': 'The title of the book'
        },
        'authors': {
            'type': 'array',
            'description': ' List of authors of the book',
            'items': {
                '$ref': 'Author'
            }

        },
        'isbn_code': {
            'description': 'Unique identifier code of the book',
            'type': 'string'

        },
        'stores': {
            'type': 'array',
            'description': 'The store where clients can buy this book',
            'items': {
                'type': 'object',
                'properties': {
                    'store': {
                        '$ref': 'Store'
                    },
                    'copies': {
                        'type': 'integer'
                    }
                }
            }
        },
        'genre':{
            'type': 'string',
            'description': 'Genre of the book'
        },
        'description': {
            'type':'string',
            'description': 'Description of the book'
        },
        'reviews': {
            'type': 'array',
            'items': {
                '$ref': 'ClientReview'
            }
        },
        'price':{
            'type': 'number',
            'minimum': 0,
            'description': 'The price of this book'

        }
    }
}