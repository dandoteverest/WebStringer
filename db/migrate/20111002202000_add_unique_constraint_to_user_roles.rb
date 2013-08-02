class AddUniqueConstraintToUserRoles < ActiveRecord::Migration
  def self.up
    add_index :user_roles, [:user_id, :role_id], :unique => true
  end

  def self.down
    remove_index :user_roles, [:user_id, :role_id]
  end
end
