class CreateRacketStringings < ActiveRecord::Migration
  def self.up
    create_table :racket_stringings do |t|
      t.references :customer_racket
      t.references :main_string
      t.float :main_tension
      t.references :cross_string
      t.float :cross_tension
      t.boolean :is_two_piece
      t.float :cost
      t.date :dropped_off
      t.date :requested_by
      t.date :strung_on
      t.timestamps
    end
  end

  def self.down
    drop_table :racket_stringings
  end
end
