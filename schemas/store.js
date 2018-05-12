module. exports = {
    'id': 'Store',
    'properties': {
        'name': {
            'type': 'string',
            'description': 'The actual name of the store'
        },
        'address':{
            'type': 'string',
            'description': 'The addres of the store'
        },
        'state':{
            'type': 'string',
            'description': 'The state where the store resides'
        },
        'phone_numbers': {
            'type': 'array',
            'description': 'List of phone numbers of the store',
            'items': {
                'type': 'string'
            }
        },
        'employees':{
            'type': 'array',
            'description': 'List of the employees of the store',
            '$ref': 'Employee'
        }
    }
}