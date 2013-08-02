class CreateRoles < ActiveRecord::Migration
  def self.up
    create_table :roles do |t|
      t.integer :value
      t.string :name

      t.timestamps
    end
    Role.create(:name => 'User', :value => 0x01)
    Role.create(:name => 'Company Admin', :value => 0x03)
    Role.create(:name => 'Site Admin', :value => 0x07)
  end

  def self.down
    drop_table :roles
  end
end
