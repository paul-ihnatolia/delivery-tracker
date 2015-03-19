class ChangeStatusToCategory < ActiveRecord::Migration
  def change
    change_table :shipments do |t|
      t.rename :status, :category
    end
  end
end
