class AddPaymentReceivedToRacketStringings < ActiveRecord::Migration
  def self.up
    add_column :racket_stringings, :payment_received, :boolean
  end

  def self.down
    remove_column :racket_stringings, :payment_received
  end
end
