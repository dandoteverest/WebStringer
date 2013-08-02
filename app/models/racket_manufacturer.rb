class RacketManufacturer < ActiveRecord::Base
  has_many :rackets, :order => 'model'
  validates_presence_of :name

  def self.all_for_json
    val = []
    RacketManufacturer.all.each{|m| val << [ m.id, m.name ]}
    val
  end
end
