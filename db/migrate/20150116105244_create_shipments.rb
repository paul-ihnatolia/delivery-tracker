class CreateShipments < ActiveRecord::Migration
  def change
    create_table :shipments do |t|
      t.string :po
      t.datetime :start_date
      t.datetime :end_date

      t.timestamps null: false
    end
  end
end
