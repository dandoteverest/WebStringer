class AddPhoneToCompanies < ActiveRecord::Migration
  def change
    add_column :companies, :phone, :integer
  end
end
