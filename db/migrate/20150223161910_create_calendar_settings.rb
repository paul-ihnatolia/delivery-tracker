class CreateCalendarSettings < ActiveRecord::Migration
  def change
    create_table :calendar_settings do |t|
      t.time :slot_duration

      t.timestamps null: false
    end
  end
end
