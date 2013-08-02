class CreateStringConstructions < ActiveRecord::Migration
  def self.up
    create_table :string_constructions do |t|
      t.string :construction
      t.timestamps
    end
  end

  def self.down
    drop_table :string_constructions
  end
end
