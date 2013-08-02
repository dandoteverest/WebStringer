class CreateStringPatterns < ActiveRecord::Migration
  def self.up
    create_table :string_patterns do |t|
      t.string :name
      t.integer :mains
      t.integer :crosses
      t.timestamps
    end
  end

  def self.down
    drop_table :string_patterns
  end
end
