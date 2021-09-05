class AddNameToUsers < ActiveRecord::Migration[6.0]
  def up
    add_column :users, :name, :string, limit: 30, default: ''
  end

  def down
    remove_column :users, :name
  end
end
