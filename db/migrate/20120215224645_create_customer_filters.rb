class CreateCustomerFilters < ActiveRecord::Migration
  def change
    create_table :customer_filters do |t|
      t.string :name
      t.string :value

      t.timestamps
    end

    CustomerFilter.create(:name => 'First Name', :value => 'first_name')
    CustomerFilter.create(:name => 'Last Name', :value => 'last_name')
  end
end
