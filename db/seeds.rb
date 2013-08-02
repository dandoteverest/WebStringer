# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

[0, 1, 2, 3, 4, 5, 6].each do |size|
  GripSize.create(size: size)
end

[[16, 15], [16, 18], [16, 19], [16, 20], [18, 19], [18, 20]].each do |pattern|
  StringPattern.create(mains: pattern[0], crosses: pattern[1], name: "#{pattern[0]} x #{pattern[1]}")
end

['Natural Gut', 'Polyester', 'Synthetic Gut', 'Kevlar', 'Multifiliment'].each do |type|
    StringConstruction.create(construction: type)
end
