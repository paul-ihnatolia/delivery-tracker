class RenameStartEndInShipments < ActiveRecord::Migration
  def self.up
    rename_column :shipments, :start, :start_date
    rename_column :shipments, :end, :end_date
  end

  def self.down
    rename_column :shipments, :start_date, :start
    rename_column :shipments, :end_date, :end
  end
end
