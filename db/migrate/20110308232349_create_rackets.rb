class CreateRackets < ActiveRecord::Migration
  def self.up
    create_table :rackets do |t|
      t.string :model
      t.integer :head_size
      t.references :racket_manufacturer
      t.references :string_pattern

      # Paperclip info
      t.string :image_file_name
      t.string :image_content_type
      t.integer :image_file_size
      t.datetime :image_updated_at
      t.timestamps
    end
  end

  def self.down
    drop_table :rackets
  end
end
