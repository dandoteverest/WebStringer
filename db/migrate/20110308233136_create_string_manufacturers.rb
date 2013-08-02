class CreateStringManufacturers < ActiveRecord::Migration
  def self.up
    create_table :string_manufacturers do |t|
      t.string :name
      t.string :url
      t.timestamps
    end
  end

  def self.down
    drop_table :string_manufacturers
  end
end