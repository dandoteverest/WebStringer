class CreateGripSizes < ActiveRecord::Migration
  def self.up
    create_table :grip_sizes do |t|
      t.integer :size
      t.timestamps
    end
  end

  def self.down
    drop_table :grip_sizes
  end
end
