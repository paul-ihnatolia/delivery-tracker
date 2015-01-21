class AddFieldsToShipment < ActiveRecord::Migration
  def change
    add_column :shipments, :company, :string
    add_column :shipments, :status, :integer, default: 0
    rename_column :shipments, :start_date, :start
    rename_column :shipments, :end_date, :end
  end
end
