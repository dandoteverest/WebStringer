class AddNotesToRacketStringings < ActiveRecord::Migration
  def self.up
    add_column :racket_stringings, :notes, :string
  end

  def self.down
    remove_column :racket_stringings, :notes
  end
end
