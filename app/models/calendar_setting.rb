class CalendarSetting < ActiveRecord::Base
  validates :slot_duration, presence: true

  def to_minutes
    time = self.slot_duration.strftime('%T').split(':')
    time[0].to_i * 60 + time[1].to_i
  end
end
