class StringManufacturer < ActiveRecord::Base
  has_many :tennis_strings, :order => "name"

  
end
