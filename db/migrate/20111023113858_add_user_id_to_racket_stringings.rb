class AddUserIdToRacketStringings < ActiveRecord::Migration
  def change
    add_column :racket_stringings, :user_id, :integer
  end
end
