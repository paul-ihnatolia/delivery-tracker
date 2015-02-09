# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create(email: 'admin@dtracker.com',
            provider: "email",
            uid: 'admin@dtracker.com',
            first_name: 'Admin',
            last_name: 'Admin',
            phone_number: '+380508337005',
            role: 'admin',
            password: '123456789',
            password_confirmation: '123456789')