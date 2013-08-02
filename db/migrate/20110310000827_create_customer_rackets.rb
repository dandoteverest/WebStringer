class CreateCustomerRackets < ActiveRecord::Migration
  def self.up
    create_table :customer_rackets do |t|
      t.references :customer
      t.references :racket
      t.references :grip_size
      t.timestamps
    end
  end

  def self.down
    drop_table :customer_rackets
  end
end
