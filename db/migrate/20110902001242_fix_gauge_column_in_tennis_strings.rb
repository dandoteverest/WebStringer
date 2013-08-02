class FixGaugeColumnInTennisStrings < ActiveRecord::Migration
  def self.up
    rename_column :tennis_strings, :guage, :gauge
  end

  def self.down
  end
end
