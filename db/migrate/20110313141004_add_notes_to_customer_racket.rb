class AddNotesToCustomerRacket < ActiveRecord::Migration
  def self.up
    add_column :customer_rackets, :notes, :string
  end

  def self.down
    remove_column :customer_rackets, :notes
  end
end
