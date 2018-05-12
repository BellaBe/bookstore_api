module.exports = {
    'id': 'Author',
    'properties': {
        'name': {
            'type': 'string',
            'description': 'The full name of the author'
        },
        'description': {
            'type': 'string',
            'description': ' A small bio of the author'
        },
        'books':{
            'type': 'array',
            'description': ' The list of books published on at least one of the stores by this author',
            'items': {
                '$ref': 'Book'
            }
        },
        'website': {
            'type': 'string',
            'description': 'the website url of the author'

        },
        'avatar':{
            'type': 'string',
            'description': 'The url for the avatar of this author'
        }

    }
}