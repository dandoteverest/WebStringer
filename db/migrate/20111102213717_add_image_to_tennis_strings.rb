class AddImageToTennisStrings < ActiveRecord::Migration
  def change
      # Paperclip info
    add_column :tennis_strings, :image_file_name, :string
    add_column :tennis_strings, :image_content_type, :string
    add_column :tennis_strings, :image_file_size, :integer
    add_column :tennis_strings, :image_updated_at, :datetime
  end
end
