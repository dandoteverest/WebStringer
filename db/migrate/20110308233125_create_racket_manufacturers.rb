class CreateRacketManufacturers < ActiveRecord::Migration
  def self.up
    create_table :racket_manufacturers do |t|
      t.string :name
      t.string :url
      t.timestamps
    end
  end

  def self.down
    drop_table :racket_manufacturers
  end
end
