class CreateTennisStrings < ActiveRecord::Migration
  def self.up
    create_table :tennis_strings do |t|
      t.references :string_manufacturer
      t.string :name
      t.float :guage
      t.references :string_construction
      t.timestamps
    end
  end

  def self.down
    drop_table :tennis_strings
  end
end
