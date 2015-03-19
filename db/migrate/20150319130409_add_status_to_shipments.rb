class AddStatusToShipments < ActiveRecord::Migration
  def change
    add_column :shipments, :status, :integer
  end
end
